using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CLIREC_Onboarding_Wizard_API.Models.DTOs;
using CLIREC_Onboarding_Wizard_API.Services;

namespace CLIREC_Onboarding_Wizard_API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "AdminOnly")]
public class AdminController : ControllerBase
{
    private readonly IRequirementsService _requirementsService;

    public AdminController(IRequirementsService requirementsService)
    {
        _requirementsService = requirementsService;
    }

    [HttpGet("requirements")]
    public async Task<ActionResult<IEnumerable<RequirementResponse>>> GetAllRequirements()
    {
        var requirements = await _requirementsService.GetAllRequirementsAsync();
        return Ok(requirements);
    }

    [HttpPut("requirements/{id}/status")]
    public async Task<ActionResult> UpdateRequirementStatus(int id, [FromBody] UpdateStatusRequest request)
    {
        var success = await _requirementsService.UpdateStatusAsync(id, request.Status);

        if (!success)
        {
            return NotFound(new { message = "Requirement not found." });
        }

        return Ok(new { message = "Status updated successfully." });
    }
}
