using QL4BIMinterpreter.QL4BIM;

namespace QL4BIMinterpreter
{
    public interface IReportWriter
    {

        void SetFilePathFromModelFile(string modelPath);

        string FilePath { get; }
        string Query { get; set; }

        void AddEntry(SetSymbol setSymbol, string opName);
        void WriteReport();
        void AddEntry(RelationSymbol relSymbol, string opName);
        void AddEntityIdMessageToCheckEntry(QLEntity entity, string message, string value);
        void StartCheckEntry(string context, string opName);
        void FinischCheckEntry();
    }
}