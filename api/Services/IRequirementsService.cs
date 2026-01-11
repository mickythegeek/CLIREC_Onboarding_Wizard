using CLIREC_Onboarding_Wizard_API.Models.DTOs;

namespace CLIREC_Onboarding_Wizard_API.Services;

public interface IRequirementsService
{
    Task<IEnumerable<RequirementResponse>> GetUserRequirementsAsync(int userId);
    Task<IEnumerable<RequirementResponse>> GetAllRequirementsAsync();
    Task<RequirementResponse?> GetRequirementByIdAsync(int id, int userId, bool isAdmin = false);
    Task<RequirementResponse> CreateRequirementAsync(int userId, CreateRequirementRequest request);
    Task<RequirementResponse?> UpdateRequirementAsync(int id, int userId, UpdateRequirementRequest request, bool isAdmin = false);
    Task<bool> DeleteRequirementAsync(int id, int userId, bool isAdmin = false);
    Task<bool> UpdateStatusAsync(int id, string status);
}
