using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CLIREC_Onboarding_Wizard_API.Models.DTOs;
using CLIREC_Onboarding_Wizard_API.Services;

namespace CLIREC_Onboarding_Wizard_API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RequirementsController : ControllerBase
{
    private readonly IRequirementsService _requirementsService;

    public RequirementsController(IRequirementsService requirementsService)
    {
        _requirementsService = requirementsService;
    }

    private int GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value) : 0;
    }

    private bool IsAdmin()
    {
        return User.IsInRole("Admin");
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RequirementResponse>>> GetMyRequirements()
    {
        var userId = GetUserId();
        var requirements = await _requirementsService.GetUserRequirementsAsync(userId);
        return Ok(requirements);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RequirementResponse>> GetRequirement(int id)
    {
        var userId = GetUserId();
        var requirement = await _requirementsService.GetRequirementByIdAsync(id, userId, IsAdmin());

        if (requirement == null)
        {
            return NotFound(new { message = "Requirement not found." });
        }

        return Ok(requirement);
    }

    [HttpPost]
    public async Task<ActionResult<RequirementResponse>> CreateRequirement([FromBody] CreateRequirementRequest request)
    {
        var userId = GetUserId();
        var requirement = await _requirementsService.CreateRequirementAsync(userId, request);
        return CreatedAtAction(nameof(GetRequirement), new { id = requirement.Id }, requirement);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<RequirementResponse>> UpdateRequirement(int id, [FromBody] UpdateRequirementRequest request)
    {
        var userId = GetUserId();
        var requirement = await _requirementsService.UpdateRequirementAsync(id, userId, request, IsAdmin());

        if (requirement == null)
        {
            return NotFound(new { message = "Requirement not found." });
        }

        return Ok(requirement);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteRequirement(int id)
    {
        var userId = GetUserId();
        var success = await _requirementsService.DeleteRequirementAsync(id, userId, IsAdmin());

        if (!success)
        {
            return NotFound(new { message = "Requirement not found." });
        }

        return NoContent();
    }

    [HttpGet("download/{id}")]
    public async Task<ActionResult> DownloadRequirement(int id)
    {
        var userId = GetUserId();
        var requirement = await _requirementsService.GetRequirementByIdAsync(id, userId, IsAdmin());

        if (requirement == null)
        {
            return NotFound(new { message = "Requirement not found." });
        }

        var fileName = $"requirement_{requirement.ClientId}_{requirement.Id}.json";
        var bytes = Encoding.UTF8.GetBytes(requirement.ResponseJson);
        return File(bytes, "application/json", fileName);
    }
}
