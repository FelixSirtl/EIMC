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
using QL4BIMinterpreter.OperatorsLevel0;
using QL4BIMinterpreter.QL4BIM;

namespace QL4BIMinterpreter.OperatorsCheck
{
    public class AttributeCheckOperator : AttributeFilterOperator, IAttributeCheckOperator
    {
        private readonly IReportWriter reportWriter;

        public AttributeCheckOperator(IReportWriter reportWriter)
        {
            this.reportWriter = reportWriter;
        }

        public override void AttributeFilterRelAtt(RelationSymbol parameterSym1, PredicateNode[] predicateNodes, RelationSymbol returnSym)
        {
            Console.WriteLine("AttributeCheck'ing...");
            //var index = parameterSym1.Index.Value; todo remove index prop
            var attributes = parameterSym1.Attributes;
            var indexAndPreps = predicateNodes.Select(p =>
             new Tuple<int, PredicateNode>((p.FirstNode as AttributeAccessNode).RelAttNode.AttIndex, p));

            reportWriter.StartCheckEntry("Validation", "AttributeCheck");

            foreach (var t in parameterSym1.Tuples)
                foreach (var ip in indexAndPreps)
                    AttributeCheckLocal(t[ip.Item1], ip.Item2);

            reportWriter.FinischCheckEntry();

            //returning empty result set as check ops results should not be used in downstream operations
            returnSym.SetTuples(new List<QLEntites>());
        }

        public override void AttributeFilterSet(SetSymbol parameterSym1, PredicateNode predicateNode, SetSymbol returnSym)
        {
            Console.WriteLine("AttributeCheck'ing...");

            reportWriter.StartCheckEntry("Validation", "AttributeCheck");

            foreach (var e in parameterSym1.Entites)
                AttributeCheckLocal(e, predicateNode);

            reportWriter.FinischCheckEntry();

            //returning empty result set as check ops results should not be used in downstream operations
            returnSym.EntityDic = new System.Collections.Generic.Dictionary<int, QLEntity>();
        }

        private void AttributeCheckLocal(QLEntity entity, PredicateNode predicateNode)
        {
            var checkResult = AttributeSetTestLocal(entity, predicateNode);
            if (!checkResult.Item1)
            {
                //return tuples: result of check, prop does exit, value preset with [0]=type, [1]=value, [2]=unnested
                var checkResultMeta = checkResult.Item3;
                var value_report = $"property exists: {checkResult.Item2}, actual type {checkResultMeta[0]}, actual value: {checkResultMeta[1]}, unnested: {checkResultMeta[2]}";
                reportWriter.AddEntityIdMessageToCheckEntry(entity, predicateNode.ToString(), value_report);
            }
        }
    }
}
