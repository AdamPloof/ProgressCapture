using System.IO;
using System.Net;
using System.Collections.Generic;
using System.Globalization;
using Microsoft.Extensions.Options;

using CsvHelper;
using CsvHelper.Configuration;

using ProgressCapture.Web.Models;
using ProgressCapture.Web.Configuration;
using ProgressCapture.Web.Exceptions;
using ProgressCapture.Web.Data;

namespace ProgressCapture.Web.Services;

/// <summary>
/// ProgressUploadHelper is a service for managing CSV uploads of progress entries.
/// </summary>
public class ProgressUploadHelper : IUploadHelper {
    private int _maxFileSizeBytes;
    private readonly IProgressRepository _progressRepo;
    private readonly ILogger<ProgressUploadHelper> _logger;
    private List<string> _errors;
    private Dictionary<string, Goal> _goalCache;
    private Dictionary<string, ProgressType> _typeCache;

    public ProgressUploadHelper(
        IOptions<FileUploadOptions> options,
        IProgressRepository progressRepo,
        ILogger<ProgressUploadHelper> logger
    ) {
        _maxFileSizeBytes = options.Value.MaxFileSizeBytes;
        _progressRepo = progressRepo;
        _logger = logger;
        _errors = [];
        _goalCache = [];
        _typeCache = [];
    }

    public async Task<List<ProgressEntry>> ReadProgress(IFormFile file) {
        _errors.Clear();
        ValidateFile(file);
        if (!IsValid()) {
            throw new InvalidUploadException(string.Join(", ", _errors));
        }

        // Ignore case when matching properties to headers
        CsvConfiguration config = new CsvConfiguration(CultureInfo.InvariantCulture) {
            PrepareHeaderForMatch = (args) => args.Header.ToLower()
        };

        List<ProgressEntry> entries = [];
        using (var reader = new StreamReader(file.OpenReadStream()))
        using (var csv = new CsvReader(reader, config)) {
            var progressRows = csv.GetRecords<ProgressCsvRow>();
            foreach (var progress in progressRows) {
                _logger.LogDebug(progress.ToString());

                // TODO: Handle integer IDs for goals/types
                Goal goal = await GetGoalByName(progress.Goal);
                ProgressType type = await GetProgressTypeByName(goal.Id, progress.Type);
                entries.Add(new ProgressEntry() {
                    Date = progress.Date,
                    Amount = progress.Amount,
                    Notes = progress.Notes,
                    ProgressTypeId = type.Id,
                    ProgressType = type
                });
            }
        }

        return entries;
    }

    private async Task<Goal> GetGoalByName(string goalName) {
        List<Goal> goals = _progressRepo.GetGoalsByName(goalName).ToList();
        if (goals.Count > 1 || goals.Count == 0) {
            throw new InvalidUploadException($"Expected one Goal for name {goalName}, got {goals.Count}");
        }

        return goals[0];
    }
    
    private async Task<ProgressType> GetProgressTypeByName(int goalId, string typeName) {
        List<ProgressType> types = _progressRepo.GetProgressTypesByName(goalId, typeName).ToList();
        if (types.Count > 1 || types.Count == 0) {
            throw new InvalidUploadException(
                $"Expected one Type for goal ID {goalId} and name {typeName}, got {types.Count}"
            );
        }

        return types[0];
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
