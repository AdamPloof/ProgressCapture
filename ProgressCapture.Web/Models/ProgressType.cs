using System.ComponentModel.DataAnnotations;

namespace ProgressCapture.Web.Models;

/// <summary>
/// ProgressType descibes the component of the progress being recorded. For
/// instance, Clinical Hours or Workout Sessions.
/// 
/// ProgressTypes are associated with a Goal.
/// </summary>
public class ProgressType {
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(255)]
    public required string Name { get; set; }

    [MaxLength(512)]
    public string? Description { get; set; }

    [Required]
    public int Target { get; set; }

    [Required]
    public int GoalId { get; set; }
    public Goal Goal { get; set; } = null!;

    [Required]
    public int UnitOfMeasureId { get; set; }
    public UnitOfMeasure UnitOfMeasure { get; set; } = null!;
}
