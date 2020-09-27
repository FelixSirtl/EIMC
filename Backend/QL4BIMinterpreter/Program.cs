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
using System.IO;
using System.Linq;
using Microsoft.Practices.Unity;
using QL4BIMinterpreter.OperatorsCheck;
using QL4BIMinterpreter.OperatorsLevel0;
using QL4BIMinterpreter.OperatorsLevel1;
using QL4BIMinterpreter.P21;
using QL4BIMinterpreter.QL4BIM;
using QL4BIMprimitives;
using QL4BIMspatial;

namespace QL4BIMinterpreter
{
    interface IExecuter
    {
        void Execute(string query);
    }

    class Executer : IExecuter
    {
        private readonly IQueryReader queryReader;
        private readonly ISymbolVisitor symbolVisitor;
        private readonly IExecutionVisitor executionVisitor;
        private readonly IReportWriter reportWriter;

        public Executer(IQueryReader queryReader, ISymbolVisitor symbolVisitor, IExecutionVisitor executionVisitor, IReportWriter reportWriter)
        {
            this.queryReader = queryReader;
            this.symbolVisitor = symbolVisitor;
            this.executionVisitor = executionVisitor;
            this.reportWriter = reportWriter;
        }

        public void Execute(string query)
        {
            //try
            //{

            reportWriter.Query = query;

            if (string.IsNullOrEmpty(query) || string.IsNullOrWhiteSpace(query))
                return;

            var queryNode = queryReader.Parse(query);
            symbolVisitor.Visit(queryNode);
            executionVisitor.Visit(queryNode);

            reportWriter.WriteReport();
            
            //}
            //catch (QueryException e)
            //{
            //    Console.Clear();
            //    Console.WriteLine(e.Message);
            //    Console.ReadLine();
            //}

        }
    }

    class Program
    {
        private const string VERSION = "1.1.0"; 

        static void Main(string[] args)
        {
            var location = System.Reflection.Assembly.GetEntryAssembly().Location;
            SetupEngineDll(location);

            var env = Environment.Is64BitProcess ? "64bit" : "32bit";
            Console.WriteLine($"->QL4BIM System {VERSION} {env} {location}");


            var container = new UnityContainer();
            MainInterface mainInterface = new MainInterface(container);
            mainInterface.GetSettings();

            container.RegisterType<ILogger, Logger>(new ContainerControlledLifetimeManager());

            container.RegisterType<IInterpreterRepository, InterpreterRepository>(new ContainerControlledLifetimeManager());
            container.RegisterType<IP21Repository, P21Repository>(new ContainerControlledLifetimeManager());
            container.RegisterType<IP21Reader, P21Reader>(new ContainerControlledLifetimeManager());

            container.RegisterType<ISpatialQueryInterpreter, SpatialQueryInterpreter>();
            container.RegisterType<IQueryReader, QueryReader>();
            container.RegisterType<ISymbolVisitor, SymbolSymbolVisitor>();
            container.RegisterType<IExecutionVisitor, ExecutionVisitor>();

            container.RegisterType<IImportModelOperator, ImportModelOperator>();
            container.RegisterType<IExportModelOperator, ExportModelOperator>();
            container.RegisterType<ITypeFilterOperator, TypeFilterOperator>();
            container.RegisterType<IAttributeFilterOperator, AttributeFilterOperator>();
            container.RegisterType<IDereferenceOperator, DereferenceOperator>();
            container.RegisterType<IProjectorOperator, ProjectorOperator>();
            container.RegisterType<IPropertyFilterOperator, PropertyFilterOperator>();
            container.RegisterType<IDeassociaterOperator, DeassociaterOperator>();
            container.RegisterType<ITaskTimerOperator, TimeResolverOperator>();
            container.RegisterType<IMaximumOperator, MaximumOperator>();

            container.RegisterType<IOperatorValidator, OperatorValidator>();
            container.RegisterType<IArgumentFilterValidator, ArguementFilterValidator>();
            container.RegisterType<IImportModelValidator, ImportModelValidator>();
            container.RegisterType<ITypeFilterValidator, TypeFilterValidator>();
            container.RegisterType<IDereferencerValidator, DereferencerValidator>();
            container.RegisterType<IProjectorValidator, ProjectorValidator>();
            container.RegisterType<IPropertyFilterValidator, PropertyFilterValidator>();
            container.RegisterType<IDeaccociaterValidator, DeassociaterValidator>();
            container.RegisterType<ITaskTimerValidator, TaskTimerValidator>();
            container.RegisterType<IMaximumValidator, MaximumValidator>();

            container.RegisterType<IAttributeCheckOperator, AttributeCheckOperator>();


            container.RegisterType<IAstBuilder, AstBuilder>();
            container.RegisterType<ISpatialTopoValidator, SpatialTopoValidator>();

            container.RegisterType<IExecuter, Executer>();
            container.RegisterType<IReportWriter, ReportWriter>(new ContainerControlledLifetimeManager());

            QLEntityExtension.Repository = container.Resolve<IP21Repository>();
            var executer = container.Resolve<IExecuter>();

            if(args.Length != 1)
            {
                Console.WriteLine("Expecting one argument containing the file path to a ql4bim query");
                Console.ReadLine();
                return;
            }

            var query = loadQuery(args[0]);
            executer.Execute(query);

        }

        private static string loadQuery(string path)
        {
            if (!File.Exists(path))
            {
                Console.WriteLine("File not found: " + path);
                return null;
            }

            try
            {
                return File.ReadAllText(path);
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception: " +  e.Message);
                return null;
            }
        }

        private static void SetupEngineDll(string location)
        {
            var curDir = Path.GetDirectoryName(location);

            var pathNav = string.Concat(Enumerable.Repeat(@"..\", 4));

            var engineX32 = Path.Combine(curDir, pathNav, @"RDF\IfcEngineBin\ifcengineX32.dll");
            var engineX64 = Path.Combine(curDir, pathNav, @"RDF\IfcEngineBin\ifcengineX64.dll");

               
            if (!File.Exists(engineX32) || !File.Exists(engineX64))
            {
                Console.WriteLine("IfcEngine binary error...check installation");
            }
        }
    }
}
