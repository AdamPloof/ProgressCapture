using System.Security.Claims;
using System.Security.Authentication;
using Microsoft.AspNetCore.Identity;

using ProgressCapture.Web.Models;

namespace ProgressCapture.Web.Services;

public class ServiceSecurity : IServiceSecurity {
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly UserManager<AppUser> _userManager;
    private AppUser? _currentUser;

    public ServiceSecurity(
        IHttpContextAccessor httpContextAccessor,
        UserManager<AppUser> userManager
    ) {
        _httpContextAccessor = httpContextAccessor;
        _userManager = userManager;
        _currentUser = null;
    }

    public async Task<AppUser?> GetCurrentUser() {
        if (_currentUser != null) {
            return _currentUser;
        }

        if (_httpContextAccessor.HttpContext == null) {
            throw new AuthenticationException("No HttpContext available");
        }

        ClaimsPrincipal cp = _httpContextAccessor.HttpContext.User;
        _currentUser = await _userManager.GetUserAsync(cp);

        return _currentUser;
    }
}
