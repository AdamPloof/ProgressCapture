using System.ComponentModel.DataAnnotations;

namespace ProgressCapture.Web.ViewModels;

public class GoalViewModel {
    [Required]
    [StringLength(255, ErrorMessage = "Maximum length is {1}")]
    public string Name { get; set; } = "";

    [StringLength(1024, ErrorMessage = "Maximum length is {1}")]
    public string? Description { get; set; }
}
