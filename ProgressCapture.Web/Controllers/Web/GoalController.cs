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
            Id = goal.Id,
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

    /// <summary>
    /// Besides editing the core fields of a Goal, this also provides a way to modify
    /// progress types associated with a Goal.
    /// </summary>
    /// <param name="goalId"></param>
    /// <returns></returns>
    [HttpGet("edit/{goalId}", Name = "EditGoal")]
    public async Task<IActionResult> Edit(int goalId) {
        Goal? goal = await _context.Goals.FindAsync(goalId);
        if (goal == null) {
            return NotFound();
        }

        IEnumerable<ProgressType> progressTypes = _context.ProgressTypes.Where(p => p.GoalId == goalId);
        GoalViewModel model = new GoalViewModel() {
            Name = goal.Name,
            Description = goal.Description,
        };

        foreach (ProgressType p in progressTypes) {
            model.ProgressTypes.Add(new ProgressTypeViewModel() {
                Name = p.Name,
                Description = p.Description,
                Target = p.Target,
                GoalId = goalId
            });
        }

        return View(model);
    }

    [HttpPost("edit/{goalId}", Name = "EditGoal")]
    public IActionResult Edit(GoalViewModel model) {
        if (!ModelState.IsValid) {
            return View(model);
        }

        return RedirectToRoute("Home");
    }
}
