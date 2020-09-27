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

namespace QL4BIMinterpreter.OperatorsLevel1
{
    class PropertyFilterOperator : IPropertyFilterOperator
    {
        public SymbolTable SymbolTable { get; set; }

        private readonly IDereferenceOperator dereferenceOperator;
        private readonly IProjectorOperator projectorOperator;
        private readonly IAttributeFilterOperator attributeFilterOperator;

        public PropertyFilterOperator(IDereferenceOperator dereferenceOperator, 
            IProjectorOperator projectorOperator, IAttributeFilterOperator attributeFilterOperator)
        {
            this.dereferenceOperator = dereferenceOperator;
            this.projectorOperator = projectorOperator;
            this.attributeFilterOperator = attributeFilterOperator;
        }

        public void PropertyFilterSet(SetSymbol parameterSym1, PredicateNode predicateNode, SetSymbol returnSym)
        {
            Console.WriteLine("PropertyFilterOperator'ing...");


            var pair = dereferenceOperator.ResolveReferenceTuplesIn(parameterSym1.Tuples, 0, false, "IsDefinedBy");
            var triple = dereferenceOperator.ResolveReferenceTuplesIn(pair, 1, false, "RelatingPropertyDefinition");
            var quadruple = dereferenceOperator.ResolveReferenceTuplesIn(triple, 2, false, "HasProperties");

            var pairEntiyProp = projectorOperator.ProjectLocal(quadruple, new [] {0, 3});

            var attAccessIn = predicateNode.FirstNode as AttributeAccessNode;
            var attAccess1 = new AttributeAccessNode(new RelAttNode(1, ""), new ExAttNode("name"));

            var predicateNode1 = GetTranformedPredNode(predicateNode, true);
            var pairAttributePresent = pairEntiyProp.Where(p => attributeFilterOperator.AttributeSetTestLocal(p[1], predicateNode1).Item1).ToArray();
            var predicateNode2 = GetTranformedPredNode(predicateNode, false);

            var result = pairAttributePresent.Where(p => attributeFilterOperator.AttributeSetTestLocal(p[1], predicateNode2).Item1).ToArray();

            returnSym.EntityDic = result.ToDictionary(k=> k[0].Id, v => v[0]);
        }

        private PredicateNode GetTranformedPredNode(PredicateNode predicateNode, bool first)
        {
            var attAccessIn = predicateNode.FirstNode as AttributeAccessNode;
            var secondNode = predicateNode.SecondNode as CStringNode;
            var attValue = first ? new CStringNode(attAccessIn.ExAttNode.Value) : secondNode;

            var attAccess1 = new AttributeAccessNode(new RelAttNode(1, ""), new ExAttNode(first ? "name" : "nominalValue"));
            var predicateNodeOut = new PredicateNode(attAccess1, ParserParts.EqualsPred, attValue);

            return predicateNodeOut;
        }
    }
}
