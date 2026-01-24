using Microsoft.AspNetCore.Mvc;

using ProgressCapture.Web.Data;
using ProgressCapture.Web.Models;
using ProgressCapture.Web.ViewModels;

namespace ProgressCapture.Web.Controllers;

[Route("/app")]
public class SpaController : Controller {
    private ProgressCaptureDbContext _context;

    public SpaController(ProgressCaptureDbContext context) {
        _context = context;
    }

    [HttpGet("")]
    public async Task<IActionResult> Index() {
        // TODO: get default goal for current user
        // TODO: get default control type for current user
        // TODO: create enum-link obj for control types to keep in sync with front-end
        Goal? goal = await _context.Goals.FindAsync(1);
        if (goal == null) {
            return NotFound();
        }

        return View(new SpaRootViewModel() {
            DefaultGoalId = goal.Id,
            ControlType = "calendar-week"
        });
    }
}
