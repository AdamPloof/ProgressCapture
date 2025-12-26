using CsvHelper.Configuration;

namespace ProgressCapture.Web.Models;

/// <summary>
/// A DTO for parsing CSV imports for progress entries. 
/// </summary>
public class ProgressCsvRow {
    public required string Goal { get; set; }
    public required string Type { get; set; }
    public required DateTime Date { get; set; }
    public required double Amount { get; set; }
    public string? Notes { get; set; }

    public override string ToString() {
        return $"""
            Goal: {Goal}
            Type: {Type}
            Date: {Date}
            Amount: {Amount}
            Notes: {Notes}
        """;
    }

    public class ProgressCsvMap : ClassMap<ProgressCsvRow> {
        public ProgressCsvMap() {
            Map(row => row.Goal);
            Map(row => row.Type);
            Map(row => row.Date).TypeConverterOption.Format("MM/dd/yyyy");
            Map(row => row.Amount);
            Map(row => row.Notes);
        }
    }
}
