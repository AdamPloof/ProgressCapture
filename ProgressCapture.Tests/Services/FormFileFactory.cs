using System.IO;
using System.Text;
using Microsoft.AspNetCore.Http;

namespace ProgressCapture.Tests.Services;

/// <summary>
/// Creates in-memory CSVs for testing file uploads
/// </summary>
public static class FormFileFactory {
    public static IFormFile CreateCsv(
        string content,
        string fileName = "test.csv",
        string fieldName = "file",
        string contentType = "text/csv"
    ) {
        byte[] bytes = Encoding.UTF8.GetBytes(content);
        var stream = new MemoryStream(bytes);
        var formFile = new FormFile(stream, 0, bytes.Length, fieldName, fileName) {
            Headers = new HeaderDictionary(),
            ContentType = contentType
        };

        return formFile;
    }
}
