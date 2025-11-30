using Microsoft.AspNetCore.Mvc;

using ProgressCapture.Web.ViewModels;
using ProgressCapture.Web.Services;

public class NavGoalsViewComponent : ViewComponent {
    private readonly IUserGoalLoader _goalLoader;

    public NavGoalsViewComponent(IUserGoalLoader goalLoader) {
        _goalLoader = goalLoader;
    }

    public async Task<IViewComponentResult> InvokeAsync(int maxGoals = 5) {
        // TODO: get User ID view user manager
        IReadOnlyList<NavGoalViewModel> goals = await _goalLoader.GetGoalsForUserAsync(1, maxGoals);

        return View(goals);
    }
}
