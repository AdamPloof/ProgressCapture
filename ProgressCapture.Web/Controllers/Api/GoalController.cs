using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

using ProgressCapture.Web.Models;
using ProgressCapture.Web.Data;

namespace ProgressCapture.Web.Controllers.Api;

[ApiController]
[Route("/api/goal")]
public class GoalController : ControllerBase {
    private ProgressCaptureDbContext _context;
    private UserManager<AppUser> _userManager;

    public GoalController(ProgressCaptureDbContext context, UserManager<AppUser> userManager) {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet("{goalId}")]
    public async Task<IActionResult> GetGoal(int goalId) {
        Goal? goal = await _context.Goals.FindAsync(goalId) ?? null;
        if (goal == null) {
            return NotFound();
        }

        AppUser? currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null || goal.AppUserId != currentUser.Id) {
            return Unauthorized();
        }

        return Ok(goal);
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetGoalsForUser() {
        AppUser? currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null) {
            return Unauthorized();
        }

        IEnumerable<Goal> goals = await _context.Goals
            .Where(g => g.AppUserId == currentUser.Id)
            .ToListAsync();

        return Ok(goals);
    }

    [HttpGet("{goalId}/progress-types")]
    public async Task<IActionResult> GetProgressEntryTypes(int goalId) {
        AppUser? currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null) {
            return Unauthorized();
        }

        List<ProgressType> entryTypes = await _context.ProgressTypes
            .Where(t => t.GoalId == goalId && t.Goal.AppUserId == currentUser.Id)
            .Include(t => t.UnitOfMeasure)
            .ToListAsync();

        return Ok(entryTypes);
    }

    [HttpGet("{goalId}/progress")]
    public async Task<IActionResult> GetProgressEntries(int goalId) {
        AppUser? currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null) {
            return Unauthorized();
        }

        List<ProgressEntry> entries = await _context.ProgressEntries
            .Where(p => p.ProgressType.GoalId == goalId && p.ProgressType.Goal.AppUserId == currentUser.Id)
            .Include(p => p.ProgressType)
            .Include(p => p.ProgressType.UnitOfMeasure)
            .ToListAsync();

        return Ok(entries);
    }
}
