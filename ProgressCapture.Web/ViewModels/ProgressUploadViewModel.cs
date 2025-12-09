using System.ComponentModel.DataAnnotations;

namespace ProgressCapture.Web.ViewModels;

public class ProgressUploadViewModel {
    [Required]
    public int GoalId { get; set; }

    
}
