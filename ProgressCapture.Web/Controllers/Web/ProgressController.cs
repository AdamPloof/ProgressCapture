using Microsoft.AspNetCore.Mvc;

using ProgressCapture.Web.Data;
using ProgressCapture.Web.Models;
using ProgressCapture.Web.ViewModels;

namespace ProgressCapture.Web.Controllers;

[Route("/progress")]
public class ProgressController : Controller {
    private readonly ProgressCaptureDbContext _context;

    public ProgressController(ProgressCaptureDbContext context) {
        _context = context;
    }

    [Route("upload/{goalId}")]
    public IActionResult Upload(int goalId) {
        return View(new ProgressUploadViewModel() { GoalId = goalId });
    }
}
