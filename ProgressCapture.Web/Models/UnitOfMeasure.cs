using System.ComponentModel.DataAnnotations;

namespace ProgressCapture.Web.Models;

/// <summary>
/// The value type used in a progress entry. Example: hours, miles, etc.
/// </summary>
public class UnitOfMeasure {
    [Key]
    public int Id { get; set; }

    [Required]
    public required string Name { get; set; }

    /// <summary>
    /// The short name or abbreviation for the uom. E.g. hr, mi, etc.
    /// </summary>
    public string? ShortName { get; set; }
}
