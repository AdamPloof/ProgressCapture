using System.ComponentModel.DataAnnotations;

namespace ProgressCapture.Web.Models;

public class ProgressEntry {
    [Key]
    public int Id { get; set; }

    [Required]
    public required ProgressType Type { get; set; }

    public DateTime? Date { get; set; }

    [Required]
    public required int Amount { get; set; }

    [MaxLength(1024)]
    public string? Notes { get; set; }
}
