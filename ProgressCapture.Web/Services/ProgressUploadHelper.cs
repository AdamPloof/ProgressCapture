using System.IO;
using System.Net;
using System.Collections.Generic;
using System.Globalization;
using Microsoft.Extensions.Options;

using CsvHelper;

using ProgressCapture.Web.Models;
using ProgressCapture.Web.Configuration;
using ProgressCapture.Web.Exceptions;

namespace ProgressCapture.Web.Services;

public class ProgressUploadHelper : IUploadHelper {
    private int _maxFileSizeBytes;
    private readonly ILogger<ProgressUploadHelper> _logger;
    private List<string> _errors;

    public ProgressUploadHelper(IOptions<FileUploadOptions> options, ILogger<ProgressUploadHelper> logger) {
        _maxFileSizeBytes = options.Value.MaxFileSizeBytes;
        _logger = logger;
        _errors = [];
    }

    public async Task ReadProgress(IFormFile file) {
        _errors.Clear();
        ValidateFile(file);
        if (!IsValid()) {
            throw new InvalidUploadException(string.Join(", ", _errors));
        }

        using (var reader = new StreamReader(file.OpenReadStream()))
        using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture)) {
            var progressRows = csv.GetRecords<ProgressCsvRow>();
            foreach (var progress in progressRows) {
                _logger.LogDebug(progress.ToString());
            }
        }

        // TODO: convert ProgressCsvRows into ProgressEntries
    }

    private void ValidateFile(IFormFile file) {
        if (file.Length == 0) {
            _errors.Add("Empty file");
        }

        if (file.Length > _maxFileSizeBytes) {
            _errors.Add($"File exceeds max file size: {_maxFileSizeBytes} bytes");
        }

        string ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (ext != ".csv") {
            _errors.Add($"Unsupported file type: {ext}");
        }
    }

    private bool IsValid() {
        return _errors.Count == 0;
    }
}
