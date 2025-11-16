using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

using ProgressCapture.Web.Models;
using ProgressCapture.Web.Data;

namespace ProgressCapture.Web.Controllers.Api;

[ApiController]
[Route("/api/progress")]
public class ProgressController : ControllerBase {
    private ProgressCaptureDbContext _context;

    public ProgressController(ProgressCaptureDbContext context) {
        _context = context;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddProgressEntry(ProgressInputModel model) {
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

        return Ok(new { id = progress.Id });
    }

    [HttpPost("update/{entryId}")]
    public async Task<IActionResult> UpdatgeProgressEntry(int entryId, ProgressInputModel model) {
        if (!ModelState.IsValid) {
            return BadRequest(
                new ValidationProblemDetails(ModelState)
            );
        }

        ProgressEntry? entry = await _context.ProgressEntries.FindAsync(entryId);
        if (entry == null) {
            return BadRequest($"Could not update progress entry. No entry found for ID: {entryId}");
        }

        entry.Date = model.Date;
        entry.Amount = model.Amount;
        entry.Notes = model.Notes;
        entry.ProgressTypeId = model.ProgressTypeId;

        await _context.SaveChangesAsync();

        return Ok(new { id = entry.Id });
    }

    [HttpPost]
    [Route("delete/{entryId}")]
    public async Task<IActionResult> DeleteProgressEntry(int entryId) {
        ProgressEntry? entry = await _context.ProgressEntries.FindAsync(entryId);
        if (entry == null) {
            return BadRequest($"No progress entry found for ID: {entryId}");
        }

        _context.ProgressEntries.Remove(entry);
        await _context.SaveChangesAsync();

        return Ok(entryId);
    }

    public class ProgressInputModel {
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
