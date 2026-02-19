using Microsoft.AspNetCore.Mvc;

using ProgressCapture.Web.ViewModels;
using ProgressCapture.Web.Services;

/// <summary>
/// Dropdown menu in navbar for user goals
/// </summary>
public class NavGoalsViewComponent : ViewComponent {
    private readonly IUserGoalLoader _goalLoader;

    public NavGoalsViewComponent(IUserGoalLoader goalLoader) {
        _goalLoader = goalLoader;
    }

    public async Task<IViewComponentResult> InvokeAsync(int maxGoals = 5) {
        IReadOnlyList<NavGoalViewModel> goals = await _goalLoader.GetGoalsForUserAsync(maxGoals);

        return View(goals);
    }
}
