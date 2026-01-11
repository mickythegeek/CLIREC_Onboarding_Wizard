using System.ComponentModel.DataAnnotations;

namespace CLIREC_Onboarding_Wizard_API.Models.DTOs;

public class CreateRequirementRequest
{
    [Required]
    public string ClientName { get; set; } = string.Empty;

    [Required]
    public string ClientId { get; set; } = string.Empty;

    [Required]
    public string Region { get; set; } = string.Empty;

    [Required]
    public string ResponseJson { get; set; } = "{}";

    public string Status { get; set; } = "Draft";
}

public class UpdateRequirementRequest
{
    public string? ClientName { get; set; }
    public string? ClientId { get; set; }
    public string? Region { get; set; }
    public string? ResponseJson { get; set; }
    public string? Status { get; set; }
}

public class RequirementResponse
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public string ResponseJson { get; set; } = "{}";
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UserEmail { get; set; }
    public string? UserFullName { get; set; }
}

public class UpdateStatusRequest
{
    [Required]
    public string Status { get; set; } = string.Empty;
}
