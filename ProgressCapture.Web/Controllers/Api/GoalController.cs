using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

using ProgressCapture.Web.Models;
using ProgressCapture.Web.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

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

    [HttpGet("{goalId}/progress-types")]
    public async Task<IActionResult> GetProgressEntryTypes(int goalId) {
        List<ProgressType> entryTypes = await _context.ProgressTypes.Where(t => t.GoalId == goalId)
            .Include(t => t.UnitOfMeasure)
            .ToListAsync();

        return Ok(entryTypes);
    }

    [HttpGet("{goalId}/progress")]
    public async Task<IActionResult> GetProgressEntries(int goalId) {
        // TODO: project related records
        List<ProgressEntry> entries = await _context.ProgressEntries
            .Where(p => p.ProgressType.GoalId == goalId)
            .Include(p => p.ProgressType)
            .Include(p => p.ProgressType.UnitOfMeasure)
            .ToListAsync();

        return Ok(entries);
    }

    [HttpPost("progress/add")]
    public async Task<IActionResult> AddProgressEntry(ProgressEntryInputModel model) {
        if (!ModelState.IsValid) {
            return BadRequest(
                new ValidationProblemDetails(ModelState)
            );
        }

        ProgressEntry progress = new ProgressEntry() {
            Date = model.Date,
            Amount = model.Amount,
            Notes = model.Notes,
            ProgressTypeId = model.ProgressTypeId
        };
        await _context.ProgressEntries.AddAsync(progress);
        await _context.SaveChangesAsync();

        return Ok(progress.Id);
    }
    
    public class ProgressEntryInputModel {
        [Required]
        public required int GoalId { get; set; }

        [Required]
        public DateTime? Date { get; set; }

        [Required]
        public required double Amount { get; set; }

        public string? Notes { get; set; }

        [Required]
        public required int ProgressTypeId { get; set; }
    }
}
