using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

using ProgressCapture.Web.Data;
using ProgressCapture.Web.Models;
using ProgressCapture.Web.ViewModels;

namespace ProgressCapture.Web.Controllers.Web;

[Route("/goal")]
public class GoalController : Controller {
    private ProgressCaptureDbContext _context;
    private UserManager<AppUser> _userManager;

    public GoalController(ProgressCaptureDbContext context, UserManager<AppUser> userManager) {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet("list", Name = "ListGoals")]
    public async Task<IActionResult> List() {
        AppUser? currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null) {
            return Unauthorized();
        }        

        List<GoalViewModel> goals = await _context.Goals
            .Where(g => g.AppUserId == currentUser.Id)
            .Select(g =>
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
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Add(GoalViewModel model) {
        if (!ModelState.IsValid) {
            return View(model);
        }

        AppUser? currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null) {
            return Unauthorized();
        }

        await _context.Goals.AddAsync(new Goal() {
            Name = model.Name,
            Description = model.Description,
            AppUserId = currentUser.Id
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

        AppUser? currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null || goal.AppUserId != currentUser.Id) {
            // TODO: should we return NotFound instead to obscure the IDs of other user's goals?
            return Unauthorized();
        }

        IEnumerable<ProgressType> progressTypes = _context.ProgressTypes.Where(p => p.GoalId == goalId);
        GoalViewModel model = new GoalViewModel() {
            Id = goalId,
            Name = goal.Name,
            Description = goal.Description,
        };

        foreach (ProgressType p in progressTypes) {
            model.ProgressTypes.Add(new ProgressTypeViewModel() {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Target = p.Target,
                GoalId = goalId
            });
        }

        return View(model);
    }

    [HttpPost("edit")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(GoalViewModel model) {
        if (!ModelState.IsValid) {
            return View(model);
        }

        Goal? goal = await _context.Goals.FindAsync(model.Id);
        if (goal == null) {
            return NotFound($"Could not find goal for ID: {model.Id}");
        }

        AppUser? currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null || goal.AppUserId != currentUser.Id) {
            return Unauthorized();
        }

        goal.Name = model.Name;
        goal.Description = model.Description;
        foreach (ProgressTypeViewModel ptModel in model.ProgressTypes) {
            if (ptModel.Id != null) {
                ProgressType? progressType = await _context.ProgressTypes.FindAsync(ptModel.Id);
                if (progressType == null) {
                    return NotFound($"Could not find progress type for ID: {ptModel.Id}");
                }

                if (progressType.GoalId != goal.Id) {
                    throw new ArgumentException($"Invalid Goal ID for Progress Type {progressType.Id}");
                }

                progressType.Name = ptModel.Name;
                progressType.Description = ptModel.Description;
                progressType.Target = ptModel.Target;
            } else {
                UnitOfMeasure uom = await _context.UnitOfMeasures
                    .Where(u => u.Name == "Hours")
                    .FirstAsync();
                ProgressType progressType = new ProgressType() {
                    Name = ptModel.Name,
                    Description = ptModel.Description,
                    Target = ptModel.Target,
                    GoalId = goal.Id,
                    UnitOfMeasureId = uom.Id // default to hours for now
                };
                goal.ProgressTypes.Add(progressType);
            }
        }

        _context.Update(goal);
        await _context.SaveChangesAsync();
        // TODO: redirect to user's most recent view type (table/calendar)

        return RedirectToRoute("App", new { goalId = model.Id });
    }
}
