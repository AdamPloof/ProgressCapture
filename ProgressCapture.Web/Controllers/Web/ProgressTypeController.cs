using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;

using ProgressCapture.Web.Data;
using ProgressCapture.Web.Models;
using ProgressCapture.Web.ViewModels;

namespace ProgressCapture.Web.Controllers.Web;

[Route("/progress-type")]
public class ProgressTypeController : Controller {
    private readonly ILogger<ProgressTypeController> _logger;
    private ProgressCaptureDbContext _context;

    public ProgressTypeController(
        ILogger<ProgressTypeController> logger,
        ProgressCaptureDbContext context
    ) {
        _logger = logger;
        _context = context;
    }

    [HttpGet("add", Name = "AddProgressType")]
    public IActionResult Add() {
        return View(new ProgressTypeViewModel());
    }

    [ValidateAntiForgeryToken]
    [HttpPost("add", Name = "AddProgressType")]
    public async Task<ActionResult> Add(ProgressTypeViewModel model, CancellationToken cancellation) {
        if (!ModelState.IsValid) {
            return View(model);
        }

        await _context.ProgressTypes.AddAsync(new ProgressType() {
            Name = model.Name,
            Description = model.Description,
        });
        await _context.SaveChangesAsync();

        return RedirectToRoute("Home");
    }
}
