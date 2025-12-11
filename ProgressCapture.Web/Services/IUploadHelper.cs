using Microsoft.AspNetCore.Http;

namespace ProgressCapture.Web.Services;

public interface IUploadHelper {
    public Task ReadProgress(IFormFile file);
}
