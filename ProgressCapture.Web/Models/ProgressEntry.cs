using System.ComponentModel.DataAnnotations;

namespace ProgressCapture.Web.Models;

/// <summary>
/// The main entity for capturing progress.
/// </summary>
public class ProgressEntry {
    [Key]
    public int Id { get; set; }

    [Required]
    public int ProgressTypeId { get; set; }

    [Required]
    public int UnitOfMeasureId { get; set; }

    public DateTime? Date { get; set; }

    [Required]
    public required int Amount { get; set; }

    [MaxLength(1024)]
    public string? Notes { get; set; }

    [Required]
    public ProgressType? ProgressType { get; set; }

    [Required]
    public UnitOfMeasure? UnitOfMeasure { get; set; }
}
