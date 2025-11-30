using ProgressCapture.Web.ViewModels;

namespace ProgressCapture.Web.Services;

public interface IUserGoalLoader {
    public Task<IReadOnlyList<NavGoalViewModel>> GetGoalsForUserAsync(
        int userId,
        int maxGoals
    );
}
