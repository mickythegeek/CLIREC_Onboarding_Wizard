using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CLIREC_Onboarding_Wizard_API.Models;

public class AccountRequirement
{
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [MaxLength(255)]
    public string ClientName { get; set; } = string.Empty;

    [MaxLength(100)]
    public string ClientId { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Region { get; set; } = string.Empty;

    /// <summary>
    /// Full wizard response data stored as JSON
    /// </summary>
    public string ResponseJson { get; set; } = "{}";

    [MaxLength(50)]
    public string Status { get; set; } = "Draft";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation property
    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;
}
