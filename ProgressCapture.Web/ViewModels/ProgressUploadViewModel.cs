using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace ProgressCapture.Web.ViewModels;

public class ProgressUploadViewModel {
    [Required]
    public IFormFile? File { get; set; }
}
