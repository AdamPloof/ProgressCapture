using Microsoft.AspNetCore.Mvc;

using ProgressCapture.Web.Data;
using ProgressCapture.Web.Models;
using ProgressCapture.Web.ViewModels;

namespace ProgressCapture.Web.Controllers.Web;

[Route("/app")]
public class SpaController : Controller {
    private ProgressCaptureDbContext _context;

    public SpaController(ProgressCaptureDbContext context) {
        _context = context;
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

        return View(new SpaRootViewModel() {
            DefaultGoalId = goalId ?? 1,
            ControlType = "calendar-week"
        });
    }
}
