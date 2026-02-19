using ProgressCapture.Web.Models;

namespace ProgressCapture.Web.Services;

/// <summary>
/// Helper for handling security related responsiblities in the service layer.
/// </summary>
public interface IServiceSecurity {
    /// <summary>
    /// Get the currently logged in user.
    /// </summary>
    public Task<AppUser?> GetCurrentUser();
}
