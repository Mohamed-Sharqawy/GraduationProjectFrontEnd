using System;

namespace Homy.Application.Dtos.ApiDtos
{
    /// <summary>
    /// Property data for listing/cards view
    /// </summary>
    public class PropertyListItemDto
    {
        public long Id { get; set; }
        public string Title { get; set; } = null!;
        public decimal Price { get; set; }
        public decimal? RentPriceMonthly { get; set; }
        public string Currency { get; set; } = "EGP";
        
        // Property Type
        public string PropertyType { get; set; } = null!;
        public string? PropertyTypeEn { get; set; }
        
        // Location
        public string City { get; set; } = null!;
        public string? CityEn { get; set; }
        public string? District { get; set; }
        public string? DistrictEn { get; set; }
        public string? ProjectName { get; set; }
        
        // Specs
        public int? Area { get; set; }
        public byte? Rooms { get; set; }
        public byte? Bathrooms { get; set; }
        
        // Images
        public string? MainImageUrl { get; set; }
        
        // Status & Features
        public bool IsFeatured { get; set; }
        public string Status { get; set; } = null!; // Active, PendingReview, etc.
        public string Purpose { get; set; } = null!; // ForSale, ForRent, Both
        public string? FinishingType { get; set; } // None, Semi, Full
        
        // Agent/Owner Info
        public Guid AgentId { get; set; }
        public string AgentName { get; set; } = null!;
        public string? AgentProfileImage { get; set; }
        
        // Additional Info
        public DateTime CreatedAt { get; set; }
        public int ViewCount { get; set; }
        
        // For frontend display
        public string Location => string.IsNullOrEmpty(District) 
            ? City 
            : $"{District}, {City}";
    }
}
