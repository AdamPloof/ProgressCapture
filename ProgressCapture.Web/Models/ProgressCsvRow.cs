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
}
