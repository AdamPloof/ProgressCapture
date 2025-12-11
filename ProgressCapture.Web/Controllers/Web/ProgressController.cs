using Microsoft.AspNetCore.Mvc;

using ProgressCapture.Web.Data;
using ProgressCapture.Web.Models;
using ProgressCapture.Web.Services;
using ProgressCapture.Web.ViewModels;

namespace ProgressCapture.Web.Controllers;

[Route("/progress")]
public class ProgressController : Controller {
    private readonly ProgressCaptureDbContext _context;
    private readonly IUploadHelper _uploadHelper;

    public ProgressController(
        ProgressCaptureDbContext context,
        IUploadHelper uploadHelper
    ) {
        _context = context;
        _uploadHelper = uploadHelper;
    }

    [HttpGet("upload")]
    public IActionResult Upload() {
        return View(new ProgressUploadViewModel());
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload(ProgressUploadViewModel model) {
        if (!ModelState.IsValid) {
            return View(model);
        }

        if (model.File != null) {
            await _uploadHelper.ReadProgress(model.File);
        }

        return View(model);
    }
}
