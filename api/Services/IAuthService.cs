using CLIREC_Onboarding_Wizard_API.Models;
using CLIREC_Onboarding_Wizard_API.Models.DTOs;

namespace CLIREC_Onboarding_Wizard_API.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<UserDto?> GetUserByIdAsync(int userId);
}
