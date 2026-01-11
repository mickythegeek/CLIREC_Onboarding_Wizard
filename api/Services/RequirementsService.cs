using Microsoft.EntityFrameworkCore;
using CLIREC_Onboarding_Wizard_API.Data;
using CLIREC_Onboarding_Wizard_API.Models;
using CLIREC_Onboarding_Wizard_API.Models.DTOs;

namespace CLIREC_Onboarding_Wizard_API.Services;

public class RequirementsService : IRequirementsService
{
    private readonly AppDbContext _context;

    public RequirementsService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<RequirementResponse>> GetUserRequirementsAsync(int userId)
    {
        return await _context.AccountRequirements
            .Include(r => r.User)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => MapToResponse(r))
            .ToListAsync();
    }

    public async Task<IEnumerable<RequirementResponse>> GetAllRequirementsAsync()
    {
        return await _context.AccountRequirements
            .Include(r => r.User)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => MapToResponse(r))
            .ToListAsync();
    }

    public async Task<RequirementResponse?> GetRequirementByIdAsync(int id, int userId, bool isAdmin = false)
    {
        var query = _context.AccountRequirements.Include(r => r.User).AsQueryable();

        if (!isAdmin)
        {
            query = query.Where(r => r.UserId == userId);
        }

        var requirement = await query.FirstOrDefaultAsync(r => r.Id == id);
        return requirement != null ? MapToResponse(requirement) : null;
    }

    public async Task<RequirementResponse> CreateRequirementAsync(int userId, CreateRequirementRequest request)
    {
        var requirement = new AccountRequirement
        {
            UserId = userId,
            ClientName = request.ClientName,
            ClientId = request.ClientId,
            Region = request.Region,
            ResponseJson = request.ResponseJson,
            Status = request.Status,
            CreatedAt = DateTime.UtcNow
        };

        _context.AccountRequirements.Add(requirement);
        await _context.SaveChangesAsync();

        // Reload with User navigation property
        await _context.Entry(requirement).Reference(r => r.User).LoadAsync();

        return MapToResponse(requirement);
    }

    public async Task<RequirementResponse?> UpdateRequirementAsync(int id, int userId, UpdateRequirementRequest request, bool isAdmin = false)
    {
        var query = _context.AccountRequirements.AsQueryable();

        if (!isAdmin)
        {
            query = query.Where(r => r.UserId == userId);
        }

        var requirement = await query.FirstOrDefaultAsync(r => r.Id == id);
        if (requirement == null) return null;

        if (request.ClientName != null) requirement.ClientName = request.ClientName;
        if (request.ClientId != null) requirement.ClientId = request.ClientId;
        if (request.Region != null) requirement.Region = request.Region;
        if (request.ResponseJson != null) requirement.ResponseJson = request.ResponseJson;
        if (request.Status != null) requirement.Status = request.Status;
        requirement.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        await _context.Entry(requirement).Reference(r => r.User).LoadAsync();

        return MapToResponse(requirement);
    }

    public async Task<bool> DeleteRequirementAsync(int id, int userId, bool isAdmin = false)
    {
        var query = _context.AccountRequirements.AsQueryable();

        if (!isAdmin)
        {
            query = query.Where(r => r.UserId == userId);
        }

        var requirement = await query.FirstOrDefaultAsync(r => r.Id == id);
        if (requirement == null) return false;

        _context.AccountRequirements.Remove(requirement);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateStatusAsync(int id, string status)
    {
        var requirement = await _context.AccountRequirements.FindAsync(id);
        if (requirement == null) return false;

        requirement.Status = status;
        requirement.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    private static RequirementResponse MapToResponse(AccountRequirement requirement)
    {
        return new RequirementResponse
        {
            Id = requirement.Id,
            UserId = requirement.UserId,
            ClientName = requirement.ClientName,
            ClientId = requirement.ClientId,
            Region = requirement.Region,
            ResponseJson = requirement.ResponseJson,
            Status = requirement.Status,
            CreatedAt = requirement.CreatedAt,
            UpdatedAt = requirement.UpdatedAt,
            UserEmail = requirement.User?.Email,
            UserFullName = requirement.User?.FullName
        };
    }
}
