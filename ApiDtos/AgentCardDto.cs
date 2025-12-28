using System;

namespace Homy.Application.Dtos.ApiDtos
{
    /// <summary>
    /// Agent/Broker card for listing page
    /// </summary>
    public class AgentCardDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = null!;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? WhatsAppNumber { get; set; }
        public string? ProfileImageUrl { get; set; }
        public bool IsVerified { get; set; }
        public bool IsActive { get; set; }
        
        // Statistics
        public int ActivePropertiesCount { get; set; }
        public int TotalPropertiesCount { get; set; }
        
        // Additional info
        public DateTime CreatedAt { get; set; }
    }
}
