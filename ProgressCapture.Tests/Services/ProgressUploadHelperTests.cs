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
using System.Runtime.Serialization;
using System.Globalization;

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
    public async Task FileWithZeroRowsReturnsEmptyList() {
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

        List<ProgressEntry> entries = await uploadHelper.ReadProgress(file);

        Assert.Empty(entries);
    }

    [Fact]
    public async Task UnsupportedFileThrows() {
        IOptions<FileUploadOptions> opts = Options.Create(new FileUploadOptions() {
            MaxFileSizeBytes = 2_000_000
        });
        StubProgressRepository progressRepo = new StubProgressRepository();
        Goal goal = new Goal() {
            Id = 1,
            Name = "foo"
        };
        progressRepo.SetGoals(new List<Goal>() { goal });

        progressRepo.SetTypes(new List<ProgressType>() {
            new ProgressType() {
                Id = 1,
                Name = "bar",
                Target = 50,
                GoalId = 1,
                Goal = goal,
                UnitOfMeasure = new UnitOfMeasure() { Id = 1, Name = "Hours", ShortName = "hrs"}
            }
        });

        ILogger<ProgressUploadHelper> logger = NullLogger<ProgressUploadHelper>.Instance;
        var uploadHelper = new ProgressUploadHelper(opts, progressRepo, logger);

        const string content = """
        goal,type,date,amount,notes
        foo,bar,2025-11-12,5,test_notes
        """;
        IFormFile file = FormFileFactory.CreateCsv(content, "test.json", "file", "application/json");

        var exception = await Assert.ThrowsAsync<InvalidUploadException>(
            () => uploadHelper.ReadProgress(file)
        );
    }

    [Fact]
    public async Task UnknownGoalNameThrows() {
        IOptions<FileUploadOptions> opts = Options.Create(new FileUploadOptions() {
            MaxFileSizeBytes = 2_000_000
        });
        StubProgressRepository progressRepo = new StubProgressRepository();
        Goal goal = new Goal() {
            Id = 1,
            Name = "foo"
        };
        progressRepo.SetGoals(new List<Goal>() { goal });

        progressRepo.SetTypes(new List<ProgressType>() {
            new ProgressType() {
                Id = 1,
                Name = "bar",
                Target = 50,
                GoalId = 1,
                Goal = goal,
                UnitOfMeasure = new UnitOfMeasure() { Id = 1, Name = "Hours", ShortName = "hrs"}
            }
        });

        ILogger<ProgressUploadHelper> logger = NullLogger<ProgressUploadHelper>.Instance;
        var uploadHelper = new ProgressUploadHelper(opts, progressRepo, logger);

        const string content = """
        goal,type,date,amount,notes
        baz,bar,2025-11-12,5,test_notes
        """;
        IFormFile file = FormFileFactory.CreateCsv(content);

        var exception = await Assert.ThrowsAsync<InvalidUploadException>(
            () => uploadHelper.ReadProgress(file)
        );
    }

    [Fact]
    public async Task UnkownProgressTypeThrows() {
        IOptions<FileUploadOptions> opts = Options.Create(new FileUploadOptions() {
            MaxFileSizeBytes = 2_000_000
        });
        StubProgressRepository progressRepo = new StubProgressRepository();
        Goal goal = new Goal() {
            Id = 1,
            Name = "foo"
        };
        progressRepo.SetGoals(new List<Goal>() { goal });

        progressRepo.SetTypes(new List<ProgressType>() {
            new ProgressType() {
                Id = 1,
                Name = "bar",
                Target = 50,
                GoalId = 1,
                Goal = goal,
                UnitOfMeasure = new UnitOfMeasure() { Id = 1, Name = "Hours", ShortName = "hrs"}
            }
        });

        ILogger<ProgressUploadHelper> logger = NullLogger<ProgressUploadHelper>.Instance;
        var uploadHelper = new ProgressUploadHelper(opts, progressRepo, logger);

        const string content = """
        goal,type,date,amount,notes
        foo,bim,2025-11-12,5,test_notes
        """;
        IFormFile file = FormFileFactory.CreateCsv(content);

        var exception = await Assert.ThrowsAsync<InvalidUploadException>(
            () => uploadHelper.ReadProgress(file)
        );
    }

    [Fact]
    public async Task MultipleGoalsSameNameThrows() {
        IOptions<FileUploadOptions> opts = Options.Create(new FileUploadOptions() {
            MaxFileSizeBytes = 2_000_000
        });
        StubProgressRepository progressRepo = new StubProgressRepository();
        Goal goal1 = new Goal() {
            Id = 1,
            Name = "foo"
        };
        Goal goal2 = new Goal() {
            Id = 2,
            Name = "foo"
        };

        progressRepo.SetGoals(new List<Goal>() { goal1, goal2 });
        progressRepo.SetTypes(new List<ProgressType>() {
            new ProgressType() {
                Id = 1,
                Name = "bar",
                Target = 50,
                GoalId = 1,
                Goal = goal1,
                UnitOfMeasure = new UnitOfMeasure() { Id = 1, Name = "Hours", ShortName = "hrs"}
            }
        });

        ILogger<ProgressUploadHelper> logger = NullLogger<ProgressUploadHelper>.Instance;
        var uploadHelper = new ProgressUploadHelper(opts, progressRepo, logger);

        const string content = """
        goal,type,date,amount,notes
        foo,baz,2025-11-12,5,test_notes
        """;
        IFormFile file = FormFileFactory.CreateCsv(content);

        var exception = await Assert.ThrowsAsync<InvalidUploadException>(
            () => uploadHelper.ReadProgress(file)
        );
    }

    [Fact]
    public async Task MultipleProgressTypesSameNameThrows() {
        IOptions<FileUploadOptions> opts = Options.Create(new FileUploadOptions() {
            MaxFileSizeBytes = 2_000_000
        });
        StubProgressRepository progressRepo = new StubProgressRepository();
        Goal goal = new Goal() {
            Id = 1,
            Name = "foo"
        };
        progressRepo.SetGoals(new List<Goal>() { goal });
        progressRepo.SetTypes(new List<ProgressType>() {
            new ProgressType() {
                Id = 1,
                Name = "bar",
                Target = 50,
                GoalId = 1,
                Goal = goal,
                UnitOfMeasure = new UnitOfMeasure() { Id = 1, Name = "Hours", ShortName = "hrs"}
            },
            new ProgressType() {
                Id = 2,
                Name = "bar",
                Target = 100,
                GoalId = 1,
                Goal = goal,
                UnitOfMeasure = new UnitOfMeasure() { Id = 1, Name = "Hours", ShortName = "hrs"}
            },
        });

        ILogger<ProgressUploadHelper> logger = NullLogger<ProgressUploadHelper>.Instance;
        var uploadHelper = new ProgressUploadHelper(opts, progressRepo, logger);

        const string content = """
        goal,type,date,amount,notes
        foo,bar,2025-11-12,5,test_notes
        """;
        IFormFile file = FormFileFactory.CreateCsv(content);

        var exception = await Assert.ThrowsAsync<InvalidUploadException>(
            () => uploadHelper.ReadProgress(file)
        );
    }

    [Fact]
    public async Task SingleProgressEntrySucceeds() {
        IOptions<FileUploadOptions> opts = Options.Create(new FileUploadOptions() {
            MaxFileSizeBytes = 2_000_000
        });
        StubProgressRepository progressRepo = new StubProgressRepository();
        Goal goal = new Goal() {
            Id = 1,
            Name = "foo"
        };
        progressRepo.SetGoals(new List<Goal>() { goal });

        progressRepo.SetTypes(new List<ProgressType>() {
            new ProgressType() {
                Id = 2,
                Name = "bar",
                Target = 50,
                GoalId = 1,
                Goal = goal,
                UnitOfMeasure = new UnitOfMeasure() { Id = 1, Name = "Hours", ShortName = "hrs"}
            },
            new ProgressType() {
                Id = 3,
                Name = "baz",
                Target = 100,
                GoalId = 1,
                Goal = goal,
                UnitOfMeasure = new UnitOfMeasure() { Id = 1, Name = "Hours", ShortName = "hrs"}
            },
        });

        ILogger<ProgressUploadHelper> logger = NullLogger<ProgressUploadHelper>.Instance;
        var uploadHelper = new ProgressUploadHelper(opts, progressRepo, logger);

        const string content = """
        goal,type,date,amount,notes
        foo,bar,2025-11-12,5,test_notes
        """;
        IFormFile file = FormFileFactory.CreateCsv(content);

        List<ProgressEntry> entries = await uploadHelper.ReadProgress(file);
        Assert.Single(entries);

        ProgressEntry entry = entries[0];
        DateTime entryDate = DateTime.ParseExact(
            "2025-11-12",
            "yyyy-MM-dd",
            CultureInfo.InvariantCulture,
            DateTimeStyles.None
        );
        Assert.Equal(entryDate, entry.Date);
        Assert.Equal(5, entry.Amount);
        Assert.Equal("test_notes", entry.Notes);
        Assert.Equal(2, entry.ProgressTypeId);
        Assert.Equal(1, entry.ProgressType.GoalId);
    }

    [Fact]
    public async Task MultipleProgressEntriesSucceeds() {
        IOptions<FileUploadOptions> opts = Options.Create(new FileUploadOptions() {
            MaxFileSizeBytes = 2_000_000
        });
        StubProgressRepository progressRepo = new StubProgressRepository();
        Goal goal = new Goal() {
            Id = 1,
            Name = "foo"
        };
        progressRepo.SetGoals(new List<Goal>() { goal });

        progressRepo.SetTypes(new List<ProgressType>() {
            new ProgressType() {
                Id = 2,
                Name = "bar",
                Target = 50,
                GoalId = 1,
                Goal = goal,
                UnitOfMeasure = new UnitOfMeasure() { Id = 1, Name = "Hours", ShortName = "hrs"}
            },
            new ProgressType() {
                Id = 3,
                Name = "baz",
                Target = 100,
                GoalId = 1,
                Goal = goal,
                UnitOfMeasure = new UnitOfMeasure() { Id = 1, Name = "Hours", ShortName = "hrs"}
            },
        });

        ILogger<ProgressUploadHelper> logger = NullLogger<ProgressUploadHelper>.Instance;
        var uploadHelper = new ProgressUploadHelper(opts, progressRepo, logger);

        const string content = """
        goal,type,date,amount,notes
        foo,bar,2025-11-12,5,bar_notes
        foo,baz,2025-11-13,10.25,baz_notes
        """;
        IFormFile file = FormFileFactory.CreateCsv(content);

        List<ProgressEntry> entries = await uploadHelper.ReadProgress(file);
        Assert.Equal(2, entries.Count);

        ProgressEntry entry1 = entries[0];
        DateTime entryDate1 = DateTime.ParseExact(
            "2025-11-12",
            "yyyy-MM-dd",
            CultureInfo.InvariantCulture,
            DateTimeStyles.None
        );
        Assert.Equal(entryDate1, entry1.Date);
        Assert.Equal(5, entry1.Amount);
        Assert.Equal("bar_notes", entry1.Notes);
        Assert.Equal(1, entry1.ProgressType.GoalId);
        Assert.Equal(2, entry1.ProgressTypeId);

        ProgressEntry entry2 = entries[1];
        DateTime entryDate2 = DateTime.ParseExact(
            "2025-11-13",
            "yyyy-MM-dd",
            CultureInfo.InvariantCulture,
            DateTimeStyles.None
        );
        Assert.Equal(entryDate2, entry2.Date);
        Assert.Equal(10.25, entry2.Amount);
        Assert.Equal("baz_notes", entry2.Notes);
        Assert.Equal(1, entry2.ProgressType.GoalId);
        Assert.Equal(3, entry2.ProgressTypeId);
    }

    [Fact]
    public async Task ParseCaseInsensitiveHeadersSucceeds() {
        IOptions<FileUploadOptions> opts = Options.Create(new FileUploadOptions() {
            MaxFileSizeBytes = 2_000_000
        });
        StubProgressRepository progressRepo = new StubProgressRepository();
        Goal goal = new Goal() {
            Id = 1,
            Name = "foo"
        };
        progressRepo.SetGoals(new List<Goal>() { goal });

        progressRepo.SetTypes(new List<ProgressType>() {
            new ProgressType() {
                Id = 2,
                Name = "bar",
                Target = 50,
                GoalId = 1,
                Goal = goal,
                UnitOfMeasure = new UnitOfMeasure() { Id = 1, Name = "Hours", ShortName = "hrs"}
            },
            new ProgressType() {
                Id = 3,
                Name = "baz",
                Target = 100,
                GoalId = 1,
                Goal = goal,
                UnitOfMeasure = new UnitOfMeasure() { Id = 1, Name = "Hours", ShortName = "hrs"}
            },
        });

        ILogger<ProgressUploadHelper> logger = NullLogger<ProgressUploadHelper>.Instance;
        var uploadHelper = new ProgressUploadHelper(opts, progressRepo, logger);

        const string content = """
        Goal,tYPE,Date,AMOUNT,noteS
        foo,bar,2025-11-12,5,bar_notes
        foo,baz,2025-11-13,10.25,baz_notes
        """;
        IFormFile file = FormFileFactory.CreateCsv(content);

        List<ProgressEntry> entries = await uploadHelper.ReadProgress(file);
        Assert.Equal(2, entries.Count);

        ProgressEntry entry1 = entries[0];
        DateTime entryDate1 = DateTime.ParseExact(
            "2025-11-12",
            "yyyy-MM-dd",
            CultureInfo.InvariantCulture,
            DateTimeStyles.None
        );
        Assert.Equal(entryDate1, entry1.Date);
        Assert.Equal(5, entry1.Amount);
        Assert.Equal("bar_notes", entry1.Notes);
        Assert.Equal(1, entry1.ProgressType.GoalId);
        Assert.Equal(2, entry1.ProgressTypeId);

        ProgressEntry entry2 = entries[1];
        DateTime entryDate2 = DateTime.ParseExact(
            "2025-11-13",
            "yyyy-MM-dd",
            CultureInfo.InvariantCulture,
            DateTimeStyles.None
        );
        Assert.Equal(entryDate2, entry2.Date);
        Assert.Equal(10.25, entry2.Amount);
        Assert.Equal("baz_notes", entry2.Notes);
        Assert.Equal(1, entry2.ProgressType.GoalId);
        Assert.Equal(3, entry2.ProgressTypeId);
    }

    private sealed class StubProgressRepository : IProgressRepository {
        private Dictionary<int, Goal> _goals = [];
        private Dictionary<int, ProgressType> _types = [];

        public void SetGoals(List<Goal> goals) {
            foreach (Goal g in goals) {
                _goals.Add(g.Id, g);
            }
        }
        
        public void SetTypes(List<ProgressType> types) {
            foreach (ProgressType t in types) {
                _types.Add(t.Id, t);
            }
        }

        public IEnumerable<Goal> GetGoalsByName(string goalName) {
            IEnumerable<Goal> goals = _goals.Where(
                kvp => kvp.Value.Name == goalName
            ).Select(kvp => kvp.Value);

            return goals;
        }

        public IEnumerable<ProgressType> GetProgressTypesByName(int goalId, string typeName) {
            IEnumerable<ProgressType> types = _types.Where(
                kvp => kvp.Value.Name == typeName
            ).Select(kvp => kvp.Value);

            return types;
        }

        public Task AddProgress(ProgressEntry entry) {
            return Task.CompletedTask;
        }

        public Task SaveChanges() {
            return Task.CompletedTask;
        }
    }
}
