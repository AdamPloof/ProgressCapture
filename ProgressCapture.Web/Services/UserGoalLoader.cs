using Microsoft.EntityFrameworkCore;

using ProgressCapture.Web.Data;
using ProgressCapture.Web.Models;
using ProgressCapture.Web.ViewModels;

namespace ProgressCapture.Web.Services;

/// <summary>
/// Gets a list of goals associated with the current user and adds them to them to the global
/// ViewData. This is used to populate the Goals list in the navbar for the logged in
/// user without having to explicitly fetch them for every controller action.
/// </summary>
public class UserGoalLoader : IUserGoalLoader {
    private ProgressCaptureDbContext _context;
    private readonly IServiceSecurity _security;

    public UserGoalLoader(ProgressCaptureDbContext context, IServiceSecurity security) {
        _context = context;
        _security = security;
    }

    public async Task<IReadOnlyList<NavGoalViewModel>> GetGoalsForUserAsync(int maxGoals = 5) {
        AppUser? currentUser = await _security.GetCurrentUser();
        if (currentUser == null) {
            return new List<NavGoalViewModel>();
        }

        return await _context.Goals
            .Where(g => g.AppUserId == currentUser.Id)
            .Take(maxGoals)
            .Select(g => new NavGoalViewModel() {
                Id = g.Id,
                Name = g.Name
            }).ToListAsync();
    }
}
