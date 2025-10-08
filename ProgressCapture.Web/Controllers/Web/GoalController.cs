using Microsoft.AspNetCore.Mvc;

using ProgressCapture.Web.Data;
using ProgressCapture.Web.Models;
using ProgressCapture.Web.ViewModels;

namespace ProgressCapture.Web.Controllers;

[Route("/goal")]
public class GoalController : Controller {
    private ProgressCaptureDbContext _context;

    public GoalController(ProgressCaptureDbContext context) {
        _context = context;
    }

    [HttpGet("add", Name = "AddGoal")]
    public IActionResult Add() {
        return View(new GoalViewModel());
    }

    [HttpPost("add", Name = "AddGoal")]
    public async Task<IActionResult> Add(GoalViewModel model) {
        if (!ModelState.IsValid) {
            return View(model);
        }

        await _context.Goals.AddAsync(new Goal() {
            Name = model.Name,
            Description = model.Description
        });
        await _context.SaveChangesAsync();

        return RedirectToRoute("Home");
    }
}
