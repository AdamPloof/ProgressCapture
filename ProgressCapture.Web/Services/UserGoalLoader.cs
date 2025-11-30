using Microsoft.EntityFrameworkCore;
using ProgressCapture.Web.Data;
using ProgressCapture.Web.ViewModels;

namespace ProgressCapture.Web.Services;

/// <summary>
/// Gets a list of goals associated with the current user and adds them to them to the global
/// ViewData. This is used to populate the Goals list in the navbar for the logged in
/// user without having to explicitly fetch them for every controller action.
/// </summary>
public class UserGoalLoader : IUserGoalLoader {
    private ProgressCaptureDbContext _context;

    public UserGoalLoader(ProgressCaptureDbContext context) {
        _context = context;
    }

    public async Task<IReadOnlyList<NavGoalViewModel>> GetGoalsForUserAsync(
        int userId,
        int maxGoals = 5
    ) {
        return await _context.Goals
            .Where(g => g.Id > 0)
            .Take(maxGoals)
            .Select(g => new NavGoalViewModel() {
                Id = g.Id,
                Name = g.Name
            }).ToListAsync();
    }
}
