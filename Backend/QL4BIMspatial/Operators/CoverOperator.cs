/*
Copyright (c) 2017 Chair of Computational Modeling and Simulation (CMS), 
Prof. André Borrmann, 
Technische Universität München, 
Arcisstr. 21, D-80333 München, Germany

This file is part of QL4BIMspatial.

QL4BIMspatial is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
any later version.

QL4BIMspatial is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with QL4BIMspatial. If not, see <http://www.gnu.org/licenses/>.
*/

using System.Collections.Generic;
using System.Linq;
using PairTriangleMesh = Microsoft.Practices.Unity.Utility.Pair<QL4BIMspatial.TriangleMesh, QL4BIMspatial.TriangleMesh>;

namespace QL4BIMspatial
{
    class CoverOperator : ICoverOperator
    {
        private readonly ITouchOperator touchOperator;
        private readonly IInsideTester insideTester;
        private readonly ISettings settings;


        public CoverOperator(ITouchOperator touchOperator, IInsideTester insideTester, ISettings settings)
        {
            this.touchOperator = touchOperator;
            this.insideTester = insideTester;
            this.settings = settings;
        }

        public IEnumerable<PairTriangleMesh> Cover(IEnumerable<PairTriangleMesh> enumerable, double positiveOffset, double negativeOffset)
        {
            foreach (var pair in enumerable)
            {
                if (Cover(pair.First, pair.Second, positiveOffset,negativeOffset))
                    yield return pair;
            }
        }

        public IEnumerable<PairTriangleMesh> Cover(IEnumerable<PairTriangleMesh> enumerable)
        {
            return Cover(enumerable, settings.Touch.PositiveOffset, settings.Touch.NegativeOffset);
        }

        public bool Cover(TriangleMesh meshA, TriangleMesh meshB)
        {
            return Cover(meshA, meshB, settings.Touch.PositiveOffset, settings.Touch.NegativeOffset);
        }

        public bool Cover(TriangleMesh meshA, TriangleMesh meshB, double positiveOffset, double negativeOffset)
        {
            if (touchOperator.TouchWithoutInnerOuterTest(meshA, meshB, positiveOffset, negativeOffset))
                return false;

            return insideTester.BIsInside(meshA, meshB); ;

        }


    }
}
