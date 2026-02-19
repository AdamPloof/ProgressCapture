using System.Security.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;

using ProgressCapture.Web.Data;
using ProgressCapture.Web.Models;
using ProgressCapture.Web.Services;
using ProgressCapture.Web.ViewModels;
using ProgressCapture.Web.Exceptions;
using ProgressCapture.Web.Extensions;

namespace ProgressCapture.Web.Controllers.Web;

[Route("/progress")]
public class ProgressController : Controller {
    private readonly ProgressCaptureDbContext _context;
    private readonly IUploadHelper _uploadHelper;
    private readonly UserManager<AppUser> _userManager;

    public ProgressController(
        ProgressCaptureDbContext context,
        IUploadHelper uploadHelper,
        UserManager<AppUser> userManager
    ) {
        _context = context;
        _uploadHelper = uploadHelper;
        _userManager = userManager;
    }

    [HttpGet("upload", Name = "upload-progress")]
    public IActionResult Upload() {
        return View(new ProgressUploadViewModel());
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload(ProgressUploadViewModel model) {
        if (!ModelState.IsValid || model.File == null) {
            return View(model);
        }

        AppUser? currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null) {
            return Unauthorized();
        }

        try {
            List<ProgressEntry> entries = await _uploadHelper.ReadProgress(model.File);
            foreach (ProgressEntry entry in entries) {
                Goal goal = entry.ProgressType.Goal;
                if (goal.AppUserId != currentUser.Id) {
                    return Unauthorized();
                }

                await _context.ProgressEntries.AddAsync(entry);
            }
            await _context.SaveChangesAsync();
            FlashMessage flash = new() {
                Title = "Import Complete",
                Type = "success",
                Message = $"Added {entries.Count} progress entries"
            };
            TempData.AddFlash(flash);

            return RedirectToRoute("Home");
        } catch (InvalidUploadException e) {
            ModelState.AddModelError(string.Empty, e.Message);

            return View(model);
        }
    }

    [HttpGet("upload-template", Name = "upload-template")]
    public async Task<IActionResult> UploadTemplate() {
        byte[] contents = await DownloadHelper.ProgressUploadTemplate();

        return File(contents, "text/csv", "progress_template.csv");
    }

    [HttpGet("download/{goalId}", Name = "download-progress")]
    public async Task<IActionResult> Download(int goalId) {
        Goal? goal = await _context.Goals.FindAsync(goalId);
        if (goal == null) {
            return NotFound();
        }

        AppUser? currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null) {
            return Unauthorized();
        }

        if (goal.AppUserId != currentUser.Id) {
            return Unauthorized();
        }

        IEnumerable<ProgressEntry> entries = _context.ProgressEntries
            .Where(e => e.ProgressType.GoalId == goalId);

        byte[] contents = await DownloadHelper.ExportProgress(entries);
        string filename = $"{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}_progress.csv";

        return File(contents, "text/csv", filename);
    }
}
