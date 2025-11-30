using System.ComponentModel.DataAnnotations;

namespace ProgressCapture.Web.ViewModels;

/// <summary>
/// View model for displaying Goal in site navigation
/// </summary>
public class NavGoalViewModel {
    [Required]
    public int Id { get; set; }

    [Required]
    public required string Name { get; set; }
}
