using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

using ProgressCapture.Web.Models;
using ProgressCapture.Web.Data;

namespace ProgressCapture.Web.Controllers.Api;

[ApiController]
[Route("/api/progress")]
public class ProgressController : ControllerBase {
    private ProgressCaptureDbContext _context;
    private readonly UserManager<AppUser> _userManager;
    private AppUser? _currentUser;

    public ProgressController(ProgressCaptureDbContext context, UserManager<AppUser> userManager) {
        _context = context;
        _userManager = userManager;
        _currentUser = null;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddProgressEntry(ProgressInputModel model) {
        if (!ModelState.IsValid) {
            return BadRequest(
                new ValidationProblemDetails(ModelState)
            );
        }

        try {
            bool authorized = await IsAuthorized(model);
            if (!authorized) {
                return Unauthorized();
            }
        } catch (ArgumentException e) {
            return BadRequest(e.Message);
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

        try {
            bool authorized = await IsAuthorized(model);
            if (!authorized) {
                return Unauthorized();
            }
        } catch (ArgumentException e) {
            return BadRequest(e.Message);
        }

        ProgressEntry? entry = await _context.ProgressEntries.FindAsync(entryId);
        if (entry == null) {
            return BadRequest($"Could not update progress entry. No entry found for ID: {entryId}");
        }
        
        if (!await IsAuthorized(entry)) {
            return Unauthorized();
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

        if (!await IsAuthorized(entry)) {
            return Unauthorized();
        }

        _context.ProgressEntries.Remove(entry);
        await _context.SaveChangesAsync();

        return Ok(entryId);
    }

    /// <summary>
    /// Check that attempts to access ProgressTypes is limited to the owners of the related goals.
    /// </summary>
    /// <remarks>Caches currentUser so that we don't have to fetch it on every check.</remarks>
    /// <param name="model"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentException"></exception>
    private async Task<bool> IsAuthorized(ProgressInputModel model) {
        AppUser? currentUser = _currentUser ?? await _userManager.GetUserAsync(User);
        if (currentUser == null) {
            return false;
        }

        _currentUser = currentUser;
        ProgressType? progressType = await _context.ProgressTypes.FindAsync(model.ProgressTypeId);
        if (progressType == null) {
            throw new ArgumentException($"Could not find ProgressType for ID {model.ProgressTypeId}");
        }

        Goal goal = progressType.Goal;
        if (goal.AppUserId != currentUser.Id) {
            return false;
        }

        return true;
    }

    /// <summary>
    /// Check that attempts to access a ProgressEntry is limited to the owner of the related goal.
    /// </summary>
    /// <remarks>Caches currentUser so that we don't have to fetch it on every check.</remarks>
    /// <param name="model"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentException"></exception>
    private async Task<bool> IsAuthorized(ProgressEntry entry) {
        AppUser? currentUser = _currentUser ?? await _userManager.GetUserAsync(User);
        if (currentUser == null) {
            return false;
        }

        _currentUser = currentUser;
        Goal goal = entry.ProgressType.Goal;
        if (goal.AppUserId != currentUser.Id) {
            return false;
        }

        return true;
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
