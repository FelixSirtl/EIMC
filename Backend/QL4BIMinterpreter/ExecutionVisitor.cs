/*
Copyright (c) 2017 Chair of Computational Modeling and Simulation (CMS), 
Prof. André Borrmann, 
Technische Universität München, 
Arcisstr. 21, D-80333 München, Germany

This file is part of QL4BIMinterpreter.

QL4BIMinterpreter is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
any later version.

QL4BIMinterpreter is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with QL4BIMinterpreter. If not, see <http://www.gnu.org/licenses/>.

*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using Microsoft.Practices.Unity;
using QL4BIMinterpreter.OperatorsCheck;
using QL4BIMinterpreter.OperatorsLevel0;
using QL4BIMinterpreter.QL4BIM;
using QL4BIMprimitives;

namespace QL4BIMinterpreter
{   
    public class ExecutionVisitor : IExecutionVisitor
    {

        private readonly ISpatialQueryInterpreter spatialQueryInterpreter;
        private readonly ITypeFilterOperator typeFilterOperator;
        private readonly IAttributeFilterOperator attributeFilterOperator;
        private readonly IAttributeCheckOperator attributeCheckOperator;
        private readonly IDereferenceOperator dereferenceOperator;
        private readonly IImportModelOperator importModelOperator;
        private readonly IExportModelOperator exportModelOperator;
        private readonly IProjectorOperator projectorOperator;
        private readonly IPropertyFilterOperator propertyFilterOperator;
        private readonly ISpatialTopoValidator spatialTopoValidator;
        private readonly ILogger logger;
        private readonly IReportWriter reportWriter;
        private readonly IDeassociaterOperator deassociaterOperator;
        private readonly ITaskTimerOperator taskTimerOperator;
        private readonly IMaximumOperator maximumOperator;

        public ExecutionVisitor( ISpatialQueryInterpreter spatialQueryInterpreter,
            ITypeFilterOperator typeFilterOperator, 
            IAttributeFilterOperator attributeFilterOperator,
            IAttributeCheckOperator attributeCheckOperator,
            IDereferenceOperator dereferenceOperator, IImportModelOperator importModelOperator,
            IExportModelOperator exportModelOperator,
            IProjectorOperator projectorOperator, IPropertyFilterOperator propertyFilterOperator,
            IDeassociaterOperator deassociaterOperator, ITaskTimerOperator taskTimerOperator,
            IMaximumOperator maximumOperator,
            ISpatialTopoValidator spatialTopoValidator, ILogger logger,
            IReportWriter reportWriter)
        {
            this.spatialQueryInterpreter = spatialQueryInterpreter;
            this.typeFilterOperator = typeFilterOperator;
            this.attributeFilterOperator = attributeFilterOperator;
            this.attributeCheckOperator = attributeCheckOperator;
            this.dereferenceOperator = dereferenceOperator;
            this.importModelOperator = importModelOperator;
            this.exportModelOperator = exportModelOperator;
            this.projectorOperator = projectorOperator;
            this.propertyFilterOperator = propertyFilterOperator;
            this.spatialTopoValidator = spatialTopoValidator;
            this.logger = logger;
            this.reportWriter = reportWriter;
            this.deassociaterOperator = deassociaterOperator;
            this.taskTimerOperator = taskTimerOperator;
            this.maximumOperator = maximumOperator;
        }
        
        private readonly IList<FunctionNode> userFuncs = new List<FunctionNode>();


        public void Visit(StatementNode statementNode)
        {
            logger.StatementIndex++;

            var symbolTable = ((FunctionNode)statementNode.Parent).SymbolTable;

            var operatorName = statementNode.OperatorNode.Value;
            if (operatorName == "ImportModel" || operatorName == "IM")
            {
                var returnSymbol = symbolTable.GetSetSymbol(statementNode.ReturnSetNode);
                var path = statementNode.Arguments[0].Value;
                importModelOperator.ImportModel(path, returnSymbol);

                reportWriter.SetFilePathFromModelFile(path);
                reportWriter.AddEntry(returnSymbol, "ImportModel");

                return;
            }

            if (operatorName == "ExportModel" || operatorName == "EM")
            {
                var returnSymbol = symbolTable.GetSetSymbol(statementNode.ReturnSetNode);
                var relSymbol = symbolTable.GetSetSymbol((SetNode)statementNode.Arguments[0]);
                exportModelOperator.ExportModel(relSymbol, statementNode.Arguments[1].Value, returnSymbol);
                return;
            }

            //overloaded
            //sig1: Set    <- Set, String
            //sig2: Relation   <- RelAtt, String VarArg
            //sig3: Relation   <- Relation, String Var arg
            if (operatorName == "TypeFilter" || operatorName == "TF")
            {
                var isRelationOverload = statementNode.Arguments[0] is RelNameNode;
                if (isRelationOverload)
                {
                    var returnSymbol = symbolTable.GetRelationSymbol(statementNode.ReturnRelationNode);
                    var relSymbol = symbolTable.GetRelationSymbol((RelNameNode) statementNode.Arguments[0]);
                    var typePreds = statementNode.Arguments.Where(a => a is TypePredNode).Cast<TypePredNode>();
                    var indicesAndTypes = typePreds.Select( tp => new Tuple<int, string>(tp.RelAttNode.AttIndex, tp.Type)).ToArray();

                    logger.LogStart(operatorName, relSymbol.EntityCount);
                    typeFilterOperator.TypeFilterRelation(relSymbol, indicesAndTypes, returnSymbol);

                    reportWriter.AddEntry(returnSymbol, "TypeFilter");

                    logger.LogStop(returnSymbol.EntityCount);
                }
                else
                {   
                    var returnSymbol = symbolTable.GetSetSymbol(statementNode.ReturnSetNode);
                    var typePred = (TypePredNode)statementNode.Arguments[0];
                    var setIn = typePred.SetNode;
                    var parameterSymbol1 = symbolTable.GetSetSymbol(setIn);

                    logger.LogStart(operatorName, parameterSymbol1.EntityCount);
                    typeFilterOperator.TypeFilterSet(parameterSymbol1, typePred.Type, returnSymbol);

                    reportWriter.AddEntry(returnSymbol, "TypeFilter");

                    logger.LogStop(returnSymbol.EntityCount);
                }
            }

            //overloaded
            //sig1: Set    <- Set, Predicate
            //sig2: Relation   <- Relation, Predicate
            if (operatorName == "AttributeFilter" || operatorName == "AF")
            {
                AttributeFilterLocal(attributeFilterOperator, statementNode, symbolTable, operatorName);
                return;
            }

            if (operatorName == "AttributeCheck" || operatorName == "AC")
            {
                AttributeFilterLocal(attributeCheckOperator, statementNode, symbolTable, operatorName);
                return;
            }

            //overloaded
            //sig1: Relation [2]    <- Set, String
            //sig3: Relation [+1]   <- Relation, String 
            if (operatorName == "Dereferencer" || operatorName == "DR")
            {
                var argCount = statementNode.Arguments.Count;
                if (argCount != 1)
                    throw new QueryException("to many arguments for Dereferencer");

                var attributeAccess =statementNode.Arguments[0] as AttributeAccessNode;
                var isRel = attributeAccess.RelAttNode != null;


                var returnSymbol = symbolTable.GetRelationSymbol(statementNode.ReturnRelationNode);
                var refs = new[] { attributeAccess.ExAttNode.Value };
                if (isRel)
                {
                    var parameterRelationSymbol = symbolTable.GetRelationSymbol(attributeAccess.RelAttNode);

                    logger.LogStart(operatorName, parameterRelationSymbol.EntityCount);
                    dereferenceOperator.ReferenceRelAtt(parameterRelationSymbol, refs, returnSymbol);
                    logger.LogStop(returnSymbol.EntityCount);
                }

                else
                {
                    var setNode = attributeAccess.SetNode;
                    var parameterSetSymbol = symbolTable.GetSetSymbol(setNode);

                    logger.LogStart(operatorName, parameterSetSymbol.EntityCount);
                    dereferenceOperator.ReferenceSet(parameterSetSymbol, refs, returnSymbol);
                    logger.LogStop(returnSymbol.EntityCount);
                }

                reportWriter.AddEntry(returnSymbol, "Dereferencer");

                return;
            }

            //overloaded
            //sig1: Relation [2]    <- Set, String
            //sig2: Relation [2]    <- Set, String, String
            //sig3: Relation [+1]   <- RelAtt, String todo
            //sig3: Relation [+1]   <- RelAtt, String, String todo
            if (operatorName == "Deassociater" || operatorName == "DA")
            {
                var returnSymbol = symbolTable.GetRelationSymbol(statementNode.ReturnRelationNode);
                var relNameNode = statementNode.Arguments[0] as RelNameNode;

                if (relNameNode != null)
                {
                    var relAttNode = statementNode.Arguments[1] as AttributeAccessNode;
                    var parameterRelationSymbol = symbolTable.GetRelationSymbol(relNameNode);
                    parameterRelationSymbol.Index = 1;
                    var exAtts = relAttNode.ExAttNode;

                    logger.LogStart(operatorName, parameterRelationSymbol.EntityCount);
                    deassociaterOperator.DeassociaterRelAtt(parameterRelationSymbol, new string[] {exAtts.Value}, returnSymbol);
                    logger.LogStop(returnSymbol.EntityCount);
                }
                else
                {
                    var attributeAccessNode = statementNode.Arguments[0] as AttributeAccessNode;
                    var setNode = attributeAccessNode.SetNode;
                    var parameterSetSymbol = symbolTable.GetSetSymbol(setNode);
                    var exAtts = attributeAccessNode.ExAttNode.Value;

                    logger.LogStart(operatorName, parameterSetSymbol.EntityCount);
                    deassociaterOperator.DeassociaterSet(parameterSetSymbol, new string[] {exAtts}, returnSymbol);
                    logger.LogStop(returnSymbol.EntityCount);
                }

                reportWriter.AddEntry(returnSymbol, "Deassociater");

                return;
            }


            if (operatorName == "Projector" || operatorName == "PR")
            {
                var arguementCount = statementNode.Arguments.Count;
                if (arguementCount == 2)
                {
                    var returnSymbolSet = symbolTable.GetSetSymbol(statementNode.ReturnSetNode);
                    var relNameNode = (RelNameNode)statementNode.Arguments[0];
                    var relAttNode = (RelAttNode)statementNode.Arguments[1];

                    var parameterRelationSymbol1 = symbolTable.GetRelationSymbol(relNameNode);
                    parameterRelationSymbol1.Index = relAttNode.AttIndex;

                    logger.LogStart(operatorName, parameterRelationSymbol1.EntityCount);
                    projectorOperator.ProjectRelAttSet(parameterRelationSymbol1, returnSymbolSet);
                    logger.LogStop(returnSymbolSet.EntityCount);
                    return;
                }
                else
                {
                    var returnSymbol = symbolTable.GetRelationSymbol(statementNode.ReturnRelationNode);

                    var relNameNode = (RelNameNode)statementNode.Arguments[0];
                    var argumentsIn = statementNode.Arguments.Skip(1).Cast<RelAttNode>().ToList();

                    var parameterRelationSymbol = symbolTable.GetRelationSymbol(relNameNode);
                    var attributesInRel = parameterRelationSymbol.Attributes;
                    var indices = argumentsIn.Select( a => a.AttIndex).ToArray();

                    logger.LogStart(operatorName, parameterRelationSymbol.EntityCount);
                    projectorOperator.ProjectRelAttRelation(parameterRelationSymbol, indices, returnSymbol);
                    logger.LogStop(returnSymbol.EntityCount);
                    return;
                }


            }

            //only set
            if (operatorName == "PropertyFilter" || operatorName == "PF")
            {
                var returnSymbol = symbolTable.GetSetSymbol(statementNode.ReturnSetNode);
                var predicateNode = statementNode.Arguments[0] as PredicateNode;

                var compareOp = predicateNode.Compare;
                var attributeAccessNode = predicateNode.FirstNode as AttributeAccessNode;
                var firstAttribute = symbolTable.GetSetSymbol(attributeAccessNode.SetNode);

                //logger.LogStart(operatorName, firstAttribute.EntityCount);
                propertyFilterOperator.PropertyFilterSet(firstAttribute, predicateNode, returnSymbol);
                reportWriter.AddEntry(returnSymbol, "PropertyFilter");
                //logger.LogStop(returnSymbol.EntityCount);
                return;
            }

            if (operatorName == "TimeResolver" || operatorName == "TR")
            {
                var returnSymbol = symbolTable.GetRelationSymbol(statementNode.ReturnRelationNode);
                var parameterRelationSymbol = symbolTable.GetRelationSymbol((RelNameNode)statementNode.Arguments[0]);
                parameterRelationSymbol.Index = ((RelAttNode) statementNode.Arguments[1]).AttIndex;

                logger.LogStart(operatorName, parameterRelationSymbol.EntityCount);
                taskTimerOperator.TimeResolverRel(parameterRelationSymbol, returnSymbol);
                logger.LogStop(returnSymbol.EntityCount);
                return;
            }

            if (operatorName == "Maximum" || operatorName == "MA")
            {
                var returnSymbol = symbolTable.GetRelationSymbol(statementNode.ReturnRelationNode);
                var parameterRelationSymbol = symbolTable.GetRelationSymbol( (RelNameNode)statementNode.Arguments[0]);
                var attributeAccessNode = (AttributeAccessNode) statementNode.Arguments[1];

                parameterRelationSymbol.Index = attributeAccessNode.RelAttNode.AttIndex;
                var exAtt = attributeAccessNode.ExAttNode;

                logger.LogStart(operatorName, parameterRelationSymbol.EntityCount);
                maximumOperator.MaximumRelAtt(parameterRelationSymbol,exAtt.Value, returnSymbol);
                logger.LogStop(returnSymbol.EntityCount);
                return;
            }

            if (spatialTopoValidator.TopoOperators.Contains(operatorName))
            {
                var returnSymbol = symbolTable.GetRelationSymbol(statementNode.ReturnRelationNode);
                var parameterSymbol1 = symbolTable.GetSetSymbol(statementNode.Arguments[0] as SetNode);
                var parameterSymbol2 = symbolTable.GetSetSymbol(statementNode.Arguments[1] as SetNode);

                logger.LogStart(operatorName, new int[] { parameterSymbol1.EntityCount, parameterSymbol2.EntityCount});
                spatialQueryInterpreter.Execute(operatorName, returnSymbol, parameterSymbol1, parameterSymbol2);
                logger.LogStop(returnSymbol.EntityCount);
                return;
            }


        }

        //method can receive attributefilter and attribute check which is an overload that returns json validation results per entity id
        void AttributeFilterLocal(IAttributeFilterOperator operatorAttribute, StatementNode statementNode, SymbolTable symbolTable, string operatorName)
        {
            if (statementNode.Arguments.Count() == 2)
            {
                var relNameNode = statementNode.Arguments[0] as RelNameNode;
                var preds = statementNode.Arguments.Where(a => a is PredicateNode).Cast<PredicateNode>().ToArray();

                var returnSymbol = symbolTable.GetRelationSymbol(statementNode.ReturnRelationNode);
                var parameterRelationSymbol = symbolTable.GetRelationSymbol(relNameNode);



                logger.LogStart(operatorName, parameterRelationSymbol.EntityCount);
                operatorAttribute.AttributeFilterRelAtt(parameterRelationSymbol, preds, returnSymbol);
                logger.LogStop(returnSymbol.EntityCount);

                if (operatorAttribute is IAttributeCheckOperator)
                    return;

                reportWriter.AddEntry(returnSymbol, "AttributeFilter");
                return;
            }
            //set
            else
            {
                
                var returnSymbol = symbolTable.GetSetSymbol(statementNode.ReturnSetNode);
                var predicateNode = statementNode.Arguments[0] as PredicateNode;
                var attributeAccessNode = predicateNode.FirstNode as AttributeAccessNode;
                
                var parameterSetSymbol = symbolTable.GetSetSymbol(attributeAccessNode.SetNode);
        

                logger.LogStart(operatorName, parameterSetSymbol.EntityCount);
                operatorAttribute.AttributeFilterSet(parameterSetSymbol, predicateNode, returnSymbol);
                logger.LogStop(returnSymbol.EntityCount);

                if (operatorAttribute is IAttributeCheckOperator)
                    return;

                reportWriter.AddEntry(returnSymbol, "AttributeFilter");

            }

        }


        public void Visit(FunctionNode functionNode)
        {
            logger.StatementIndex = 0;

            var firstStatement = functionNode.FirstStatement;
            if (firstStatement == null)
                return;

            var statement = firstStatement;
            do
            {
                statement.Accept(this);
                statement = statement.Next;
            } while (statement != null);

            Console.WriteLine();
            Console.WriteLine("Query execution has finished");
            Console.WriteLine("Press enter to see content of last assigned symbol.");
        }
    }
}
