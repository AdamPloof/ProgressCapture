using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

using ProgressCapture.Web.Models;

namespace ProgressCapture.Web.Data;

public class ProgressRepository : IProgressRepository {
    private readonly ProgressCaptureDbContext _context;

    public ProgressRepository(ProgressCaptureDbContext context) {
        _context = context;
    }

    public IEnumerable<Goal> GetGoalsByName(string goalName) {
        return _context.Goals.Where(g => g.Name == goalName);
    }

    public IEnumerable<ProgressType> GetProgressTypesByName(int goalId, string typeName) {
        return _context.ProgressTypes.Where(
            t => t.Name == typeName && t.GoalId == goalId
        );
    }

    public async Task AddProgress(ProgressEntry entry) {
        await _context.ProgressEntries.AddAsync(entry);
    }

    public async Task SaveChanges() {
        await _context.SaveChangesAsync();
    }
}
