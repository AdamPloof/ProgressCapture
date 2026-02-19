using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;

using ProgressCapture.Web.Data;
using ProgressCapture.Web.Models;
using ProgressCapture.Web.ViewModels;

namespace ProgressCapture.Web.Controllers.Web;

[Route("/app")]
public class SpaController : Controller {
    private ProgressCaptureDbContext _context;
    private readonly UserManager<AppUser> _userManager;

    public SpaController(ProgressCaptureDbContext context, UserManager<AppUser> userManager) {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet("{goalId?}", Name = "App")]
    public async Task<IActionResult> Index(int? goalId) {
        // TODO: get default goal for current user if goalId is null
        // TODO: get default control type for current user
        // TODO: create enum-link obj for control types to keep in sync with front-end
        Goal? goal = await _context.Goals.FindAsync(goalId ?? 1);
        if (goal == null) {
            return NotFound();
        }

        AppUser? currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null || goal.AppUserId != currentUser.Id) {
            return Unauthorized();
        }

        return View(new SpaRootViewModel() {
            DefaultGoalId = goalId ?? 1,
            ControlType = "calendar-week"
        });
    }
}
