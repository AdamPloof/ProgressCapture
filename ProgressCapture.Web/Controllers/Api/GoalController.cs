using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

using ProgressCapture.Web.Models;
using ProgressCapture.Web.Data;
using Microsoft.EntityFrameworkCore;

namespace ProgressCapture.Web.Controllers.Api;

[ApiController]
[Route("/api/goal")]
public class GoalController : ControllerBase {
    private ProgressCaptureDbContext _context;

    public GoalController(ProgressCaptureDbContext context) {
        _context = context;
    }

    [HttpGet("{goalId}")]
    public async Task<IActionResult> Info(int goalId) {
        Goal? goal = await _context.Goals.FindAsync(goalId) ?? null;

        return Ok(goal);
    }

    [HttpGet("{goalId}/progress")]
    public async Task<IActionResult> GetProgressEntries(int goalId) {
        // TODO: project related records
        List<ProgressEntry> entries = await _context.ProgressEntries
            .Where(p => p.ProgressType.GoalId == goalId)
            .Include(p => p.ProgressType)
            .ToListAsync();

        return Ok(entries);
    }
}
