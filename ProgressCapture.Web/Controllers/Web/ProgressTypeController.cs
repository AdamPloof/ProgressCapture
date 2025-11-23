using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

    [HttpGet("add/{goalId}", Name = "AddProgressType")]
    public IActionResult Add(int goalId) {
        return View(new ProgressTypeViewModel() {GoalId = goalId});
    }

    [ValidateAntiForgeryToken]
    [HttpPost("add/{goalId}", Name = "AddProgressType")]
    public async Task<ActionResult> Add(
        ProgressTypeViewModel model,
        int goalId,
        CancellationToken cancellation
    ) {
        if (!ModelState.IsValid) {
            return View(model);
        }

        // TODO: eventually we want to allow the user to select the uom
        UnitOfMeasure uom = await _context.UnitOfMeasures.Where(u => u.Name == "Hours").FirstAsync();

        await _context.ProgressTypes.AddAsync(new ProgressType() {
            Name = model.Name,
            Description = model.Description,
            GoalId = goalId,
            Target = model.Target,
            UnitOfMeasureId = uom.Id
        });
        await _context.SaveChangesAsync();

        return RedirectToRoute("Home");
    }
}
