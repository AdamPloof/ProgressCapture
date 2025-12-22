using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

using ProgressCapture.Web.Models;

namespace ProgressCapture.Web.Services;

public interface IUploadHelper {
    public Task<List<ProgressEntry>> ReadProgress(IFormFile file);
}
