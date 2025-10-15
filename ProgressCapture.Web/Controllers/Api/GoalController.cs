using Microsoft.AspNetCore.Mvc;
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

    [HttpGet("{goalId}/progress")]
    public async Task<IActionResult> GetProgressEntries(int goalId) {
        List<ProgressEntry> entries = _context.ProgressEntries
            .Where(p => p.ProgressType.GoalId == goalId)
            .ToList();

        return Ok(entries);
    }
}
