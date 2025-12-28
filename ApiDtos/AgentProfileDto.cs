using System;
using System.Collections.Generic;

namespace Homy.Application.Dtos.ApiDtos
{
    /// <summary>
    /// Complete agent profile with their properties
    /// </summary>
    public class AgentProfileDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = null!;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? WhatsAppNumber { get; set; }
        public string? ProfileImageUrl { get; set; }
        public bool IsVerified { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        
        // Statistics
        public int TotalPropertiesCount { get; set; }
        public int ActivePropertiesCount { get; set; }
        public int SoldOrRentedCount { get; set; }
        
        // Agent's Properties
        public List<PropertyListItemDto> Properties { get; set; } = new();
    }
}
