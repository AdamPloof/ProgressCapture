using System.ComponentModel.DataAnnotations;

namespace ProgressCapture.Web.ViewModels;

public class SpaRootViewModel {
    public int? DefaultGoalId { get; set; } = null;

    [Required]
    public string ControlType { get; set; } = "calendar";
}
