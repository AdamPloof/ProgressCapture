using System.Globalization;
using Microsoft.AspNetCore.Http;
using CsvHelper;
using CsvHelper.Configuration;

using ProgressCapture.Web.Models;

namespace ProgressCapture.Web.Services;

/// <summary>
/// Utility class for exporting progress entries 
/// </summary>
public static class DownloadHelper {

    /// <summary>
    /// Convert Progress Entries into a bytes array for returning as a CSV file
    /// </summary>
    /// <param name="entries"></param>
    /// <returns></returns>
    public static async Task<byte[]> ExportProgress(IEnumerable<ProgressEntry> entries) {
        using var ms = new MemoryStream();
        using (var writer = new StreamWriter(ms))
        using (var csv = new CsvWriter(writer, new CsvConfiguration(CultureInfo.InvariantCulture))) {
            await csv.WriteRecordsAsync(entries);
        }

        return ms.ToArray();
    }

    /// <summary>
    /// Get a CSV with the headers for a progress upload file
    /// </summary>
    /// <returns></returns>
    public static async Task<byte[]> ProgressUploadTemplate() {
        using var ms = new MemoryStream();
        using (var writer = new StreamWriter(ms))
        using (var csv = new CsvWriter(writer, new CsvConfiguration(CultureInfo.InvariantCulture))) {
            csv.Context.RegisterClassMap<ProgressCsvRow.ProgressCsvMap>();
            List<ProgressCsvRow> rows = [new ProgressCsvRow() {
                Goal = "goal...",
                Type = "type...",
                Date = DateTime.UnixEpoch,
                Amount = 1,
                Notes = "notes..."
            }];
            await csv.WriteRecordsAsync(rows);
        }

        return ms.ToArray();
    }
}
