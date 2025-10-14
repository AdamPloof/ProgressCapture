using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

using ProgressCapture.Web.Data;
using ProgressCapture.Web.Models;
using ProgressCapture.Web.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace ProgressCapture.Web.Controllers;

[Route("/goal")]
public class GoalController : Controller {
    private ProgressCaptureDbContext _context;

    public GoalController(ProgressCaptureDbContext context) {
        _context = context;
    }

    [HttpGet("{goalId}", Name = "ViewGoal")]
    public async Task<IActionResult> View(int goalId) {
        Goal? goal = await _context.Goals.FindAsync(goalId);
        if (goal == null) {
            return NotFound();
        }

        return View(new GoalViewModel() {
            Name = goal.Name,
            Description = goal.Description
        });
    }

    [HttpGet("list", Name = "ListGoals")]
    public async Task<IActionResult> List() {
        List<GoalViewModel> goals = await _context.Goals.Select(g =>
            new GoalViewModel() {
                Id = g.Id,
                Name = g.Name,
                Description = g.Description,
            }
        ).ToListAsync();

        return View(new GoalListViewModel() {Goals = goals});
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
