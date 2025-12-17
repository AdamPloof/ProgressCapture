using Xunit;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;

using ProgressCapture.Web.Services;
using ProgressCapture.Web.Data;
using ProgressCapture.Web.Configuration;
using ProgressCapture.Web.Exceptions;
using ProgressCapture.Web.Models;

namespace ProgressCapture.Tests.Services;

public class ProgressUploadHelperTests {
    [Fact]
    public async Task FileIsEmptyThrows() {
        IOptions<FileUploadOptions> opts = Options.Create(new FileUploadOptions() {
            MaxFileSizeBytes = 2_000_000
        });
        IProgressRepository progressRepo = new StubProgressRepository();
        ILogger<ProgressUploadHelper> logger = NullLogger<ProgressUploadHelper>.Instance;
        var uploadHelper = new ProgressUploadHelper(opts, progressRepo, logger);

        const string content = "";
        IFormFile file = FormFileFactory.CreateCsv(content);

        var exception = await Assert.ThrowsAsync<InvalidUploadException>(
            () => uploadHelper.ReadProgress(file)
        );
    }

    [Fact]
    public async Task FileWithZeroRowsThrows() {
        IOptions<FileUploadOptions> opts = Options.Create(new FileUploadOptions() {
            MaxFileSizeBytes = 2_000_000
        });
        IProgressRepository progressRepo = new StubProgressRepository();
        ILogger<ProgressUploadHelper> logger = NullLogger<ProgressUploadHelper>.Instance;
        var uploadHelper = new ProgressUploadHelper(opts, progressRepo, logger);

        const string content = """
        goal,type,date,amount,notes
        """;
        IFormFile file = FormFileFactory.CreateCsv(content);

        var exception = await Assert.ThrowsAsync<InvalidUploadException>(
            () => uploadHelper.ReadProgress(file)
        );
    }

    // [Fact]
    // public void UnsupportedFileThrows() {

    // }

    // [Fact]
    // public void UnknownGoalNameThrows() {

    // }

    // [Fact]
    // public void UnkownProgressTypeThrows() {

    // }

    // [Fact]
    // public void MultipleGoalsSameNameThrows() {

    // }

    // [Fact]
    // public void MultipleProgressTypesSameNameThrows() {

    // }

    // [Fact]
    // public void SingleProgressEntrySucceeds() {

    // }

    // [Fact]
    // public void MultipleProgressEntriesSucceeds() {

    // }

    // [Fact]
    // public void ParseCaseInsensitiveSucceeds() {

    // }

    private sealed class StubProgressRepository : IProgressRepository {
        private Dictionary<string, Goal> _goals = [];
        private Dictionary<string, ProgressType> _types = [];

        public void SetGoals(List<Goal> goals) {
            foreach (Goal g in goals) {
                _goals.Add(g.Name, g);
            }
        }
        
        public void SetType(List<ProgressType> types) {
            foreach (ProgressType t in types) {
                _types.Add(t.Name, t);
            }
        }

        public IEnumerable<Goal> GetGoalsByName(string goalName) {
            IEnumerable<Goal> goals = _goals.Where(
                kvp => kvp.Key == goalName
            ).Select(kvp => kvp.Value);

            return goals;
        }

        public IEnumerable<ProgressType> GetProgressTypesByName(int goalId, string typeName) {
            IEnumerable<ProgressType> types = _types.Where(
                kvp => kvp.Key == typeName
            ).Select(kvp => kvp.Value);

            return types;
        }

        public Task AddProgress(ProgressEntry entry) {
            return new Task(() => { });
        }

        public Task SaveChanges() {
            return new Task(() => { });
        }
    }
}
