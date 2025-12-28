using System;
using System.Collections.Generic;

namespace Homy.Application.Dtos.ApiDtos
{
    /// <summary>
    /// Complete property details for property view page
    /// </summary>
    public class PropertyDetailsDto
    {
        public long Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        
        // Pricing
        public decimal Price { get; set; }
        public decimal? RentPriceMonthly { get; set; }
        public string Currency { get; set; } = "EGP";
        
        // Property Type
        public long PropertyTypeId { get; set; }
        public string PropertyType { get; set; } = null!;
        public string? PropertyTypeEn { get; set; }
        
        // Location
        public long CityId { get; set; }
        public string City { get; set; } = null!;
        public string? CityEn { get; set; }
        public long? DistrictId { get; set; }
        public string? District { get; set; }
        public string? DistrictEn { get; set; }
        public long? ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public string? AddressDetails { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        
        // Specs
        public int? Area { get; set; }
        public byte? Rooms { get; set; }
        public byte? Bathrooms { get; set; }
        public byte? FloorNumber { get; set; }
        
        // Status & Features
        public string Status { get; set; } = null!;
        public string Purpose { get; set; } = null!;
        public string? FinishingType { get; set; }
        public bool IsFeatured { get; set; }
        public DateTime? FeaturedUntil { get; set; }
        public bool IsAgricultural { get; set; }
        
        // Images
        public List<PropertyImageDto> Images { get; set; } = new();
        
        // Amenities
        public List<AmenityDto> Amenities { get; set; } = new();
        
        // Agent/Owner Info
        public AgentInfoDto Agent { get; set; } = null!;
        
        // Stats
        public int ViewCount { get; set; }
        public int WhatsAppClicks { get; set; }
        public int PhoneClicks { get; set; }
        
        // Dates
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
    
    public class PropertyImageDto
    {
        public long Id { get; set; }
        public string ImageUrl { get; set; } = null!;
        public bool IsMain { get; set; }
        public int SortOrder { get; set; }
    }
    
    public class AmenityDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = null!;
        public string? NameEn { get; set; }
        public string? IconUrl { get; set; }
    }
    
    public class AgentInfoDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = null!;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? WhatsAppNumber { get; set; }
        public string? ProfileImageUrl { get; set; }
        public bool IsVerified { get; set; }
        public int ActivePropertiesCount { get; set; }
    }
}
