﻿using Microsoft.Practices.ObjectBuilder2;
using Microsoft.Practices.Unity.Utility;
using Newtonsoft.Json.Linq;
using QL4BIMinterpreter.QL4BIM;
using QL4BIMspatial;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QL4BIMinterpreter
{
    public class ReportWriter : IReportWriter
    {
        readonly List<Tuple<string, string, string>> checkSB = new List<Tuple<string, string, string>>();
        private ReportEntry checkReportEntry;

        public string FilePath { get; set; }

        readonly IList<ReportEntry> reportEntries;

        public string Query { get; set; }

        public ReportWriter()
        {
            reportEntries = new List<ReportEntry>();
        }

        public void AddEntry(SetSymbol setSymbol, string opName)
        {
            var entry = new ReportEntry();
            entry.Context = setSymbol.Value;
            entry.Operator = opName;

            var entities = setSymbol.Entites;
            entry.ElementCount = entities.Length.ToString();
            if (entities.Length > 100)
            {
                entry.OnlyTopItems = true;
                entities = new QLEntites(entities.Take(100).ToArray());
            }

            entry.EntityIds = entities.Select(e => EntityToId(e)).ToList();
            reportEntries.Add(entry);
        }

        public void StartCheckEntry(string context, string opName)
        {
            checkReportEntry = new ReportEntry();
            checkReportEntry.Context = context;
            checkReportEntry.Operator = opName;

            checkSB.Clear();
        }

        public void FinischCheckEntry()
        {
            checkReportEntry.EntityIds = new List<Tuple<string, string, string>>(checkSB);

            reportEntries.Add(checkReportEntry);
        }

        public void AddEntityIdMessageToCheckEntry(QLEntity entity, string message, string value)
        {
            checkSB.Add(new Tuple<string, string, string>(EntityToId(entity), message, value));
        }

        private string EntityToId(QLEntity entity)
        {
            if (string.IsNullOrEmpty(entity.GlobalId))
                return "IID_" + entity.Id;
            else
                return "GID_" + entity.GlobalId;
        }

        public void AddEntry(RelationSymbol relSymbol, string opName)
        {
            var entry = new ReportEntry();
            entry.Context = relSymbol.Value;
            entry.Operator = opName;

            var tuples = relSymbol.Tuples.ToArray();

            entry.ElementCount = tuples.Length.ToString();

            if (tuples.Length > 100)
            {
                entry.OnlyTopItems = true;
                tuples = tuples.Take(100).ToArray();
            }


            entry.EntityIds = tuples.Select(tuple =>
            {
                return tuple.Select(e => EntityToId(e)).ToList();
            }).ToList();

            reportEntries.Add(entry);
        }

        public void WriteReport()
        {
            var report = new ReportMeta(reportEntries);

            report.Query = this.Query;

            JObject o = (JObject)JToken.FromObject(report);

            var jsonout = o.ToString();
            File.AppendAllText(FilePath, jsonout);
        }

        public void SetFilePathFromModelFile(string modelPath)
        {
            var isRelative = !Path.IsPathFullyQualified(modelPath);

            if(isRelative)
            {   
                if(OsHelper.IsWindows())
                    modelPath = Path.Combine(@"..\..\..\..\", modelPath);
                else if (OsHelper.IsLinux())
                    modelPath = Path.Combine(@"../reports/", modelPath);
                else
                    throw new NotSupportedException();
            }

            var now = DateTime.Now.ToString("yyyyMMddHHmmssffff");
            FilePath = Path.Combine(Path.GetDirectoryName(modelPath), "report_" + now + ".json");
        }
    }

    public class ReportMeta
    {
        public DateTime DateTime { get; set; }


        public string Query { get; set; }

        public IList<ReportEntry> ReportEntries { get; set; }

        public ReportMeta(IList<ReportEntry> reportEntries)
        {
            DateTime = DateTime.Now;
            ReportEntries = reportEntries;
        }
    }

    public class ReportEntry
    {
        public string Operator { get; set; }
        public string Context { get; set; }

        public bool OnlyTopItems { get; set; }

        public string ElementCount { get; set; }

        public dynamic EntityIds { get; set; }
    }

    public class EntityId {
        public string Guid { get; set; }
        public string InternalId { get; set; }

        public EntityId(string guid, string internalid)
        {
            Guid = guid;
            InternalId = internalid;
        }
    }
}