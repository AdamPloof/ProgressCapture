using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProgressCapture.Web.Models;

/// <summary>
/// The overall goal that progress is being tracked towards.
/// 
/// A goal has one or more ProgressTypes that have individual targets. ProgressTypes
/// can be thought of as sub-goals or components of the main Goal.
/// </summary>
public class Goal {
    [Required]
    public int Id { get; set; }

    [Required]
    [StringLength(255, ErrorMessage = "Maximum length is {1}")]
    public required string Name { get; set; }

    [StringLength(1024, ErrorMessage = "Maximum length is {1}")]
    public string? Description { get; set; }

    [Required]
    public required string AppUserId { get; set; }
    public AppUser User { get; set; } = null!;

    public ICollection<ProgressType> ProgressTypes { get; set; } = new List<ProgressType>();
}
