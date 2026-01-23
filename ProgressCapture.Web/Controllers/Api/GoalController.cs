using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

using ProgressCapture.Web.Models;
using ProgressCapture.Web.Data;

namespace ProgressCapture.Web.Controllers.Api;

[ApiController]
[Route("/api/goal")]
public class GoalController : ControllerBase {
    private ProgressCaptureDbContext _context;

    public GoalController(ProgressCaptureDbContext context) {
        _context = context;
    }

    [HttpGet("{goalId}")]
    public async Task<IActionResult> GetGoal(int goalId) {
        Goal? goal = await _context.Goals.FindAsync(goalId) ?? null;

        return Ok(goal);
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetGoalsForUser() {
        IEnumerable<Goal> goals = await _context.Goals.ToListAsync();

        return Ok(goals);
    }

    [HttpGet("{goalId}/progress-types")]
    public async Task<IActionResult> GetProgressEntryTypes(int goalId) {
        List<ProgressType> entryTypes = await _context.ProgressTypes.Where(t => t.GoalId == goalId)
            .Include(t => t.UnitOfMeasure)
            .ToListAsync();

        return Ok(entryTypes);
    }

    [HttpGet("{goalId}/progress")]
    public async Task<IActionResult> GetProgressEntries(int goalId) {
        List<ProgressEntry> entries = await _context.ProgressEntries
            .Where(p => p.ProgressType.GoalId == goalId)
            .Include(p => p.ProgressType)
            .Include(p => p.ProgressType.UnitOfMeasure)
            .ToListAsync();

        return Ok(entries);
    }
}
