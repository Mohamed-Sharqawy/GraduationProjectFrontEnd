using Homy.Domin.models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Homy.Application.Dtos.ApiDtos
{
    /// <summary>
    /// DTO for creating a new property (bilingual AR/EN)
    /// </summary>
    public class CreatePropertyDto
    {
        // Basic Info - Arabic
        [Required(ErrorMessage = "العنوان مطلوب")]
        [MaxLength(500)]
        public string Title { get; set; } = null!;

        public string? Description { get; set; }

        // Basic Info - English
        [MaxLength(500)]
        public string? TitleEn { get; set; }

        public string? DescriptionEn { get; set; }

        // Location
        [Required]
        public long CityId { get; set; }

        public long? DistrictId { get; set; }

        public long? ProjectId { get; set; }

        [MaxLength(1000)]
        public string? AddressDetails { get; set; }

        [MaxLength(1000)]
        public string? AddressDetailsEn { get; set; }

        [Range(-90, 90)]
        public decimal? Latitude { get; set; }

        [Range(-180, 180)]
        public decimal? Longitude { get; set; }

        // Property Details
        [Required]
        public long PropertyTypeId { get; set; }

        [Required]
        public PropertyPurpose Purpose { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? RentPriceMonthly { get; set; }

        [Range(0, 10000)]
        public int? Rooms { get; set; }

        [Range(0, 100)]
        public int? Bathrooms { get; set; }

        [Range(0, 1000000)]
        public decimal? Area { get; set; }

        public FinishingType? FinishingType { get; set; }

        [Range(0, 200)]
        public int? FloorNumber { get; set; }

        public bool IsAgricultural { get; set; }

        public bool IsFeatured { get; set; }

        // Images (6 images max, 1 primary)
        [Required]
        [MinLength(1, ErrorMessage = "يجب رفع صورة واحدة على الأقل")]
        [MaxLength(6, ErrorMessage = "الحد الأقصى 6 صور")]
        public List<IFormFile> Images { get; set; } = new();

        [Range(0, 5, ErrorMessage = "يجب أن يكون رقم الصورة الرئيسية بين 0 و 5")]
        public int PrimaryImageIndex { get; set; } = 0;
    }

    /// <summary>
    /// DTO for updating an existing property
    /// </summary>
    public class UpdatePropertyDto : CreatePropertyDto
    {
        // Inherit all fields from CreatePropertyDto
        // Images are optional when updating
        public new List<IFormFile>? Images { get; set; }
    }

    /// <summary>
    /// DTO for admin property approval/rejection
    /// </summary>
    public class PropertyApprovalDto
    {
        [Required]
        public long PropertyId { get; set; }

        [Required]
        public bool IsApproved { get; set; }

        [MaxLength(500)]
        public string? RejectionReason { get; set; }
    }

    /// <summary>
    /// DTO for property card in listings
    /// </summary>
    public class PropertyCardDto
    {
        public long Id { get; set; }
        public string Title { get; set; } = null!;
        public string? TitleEn { get; set; }
        public decimal Price { get; set; }
        public string PropertyType { get; set; } = null!;
        public string? PropertyTypeEn { get; set; }
        public string City { get; set; } = null!;
        public string? CityEn { get; set; }
        public string? District { get; set; }
        public string? PrimaryImageUrl { get; set; }
        public PropertyPurpose Purpose { get; set; }
        public PropertyStatus Status { get; set; }
        public int? Rooms { get; set; }
        public int? Bathrooms { get; set; }
        public decimal? Area { get; set; }
        public bool IsFeatured { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// DTO for agent profile update
    /// </summary>
    public class AgentProfileUpdateDto
    {
        [Required]
        [MaxLength(200)]
        public string FullName { get; set; } = null!;

        [Phone]
        public string? PhoneNumber { get; set; }

        [Phone]
        public string? WhatsAppNumber { get; set; }

        public IFormFile? ProfileImage { get; set; }
    }

    /// <summary>
    /// DTO for password change
    /// </summary>
    public class ChangePasswordDto
    {
        [Required]
        public string CurrentPassword { get; set; } = null!;

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; } = null!;

        [Required]
        [Compare(nameof(NewPassword))]
        public string ConfirmPassword { get; set; } = null!;
    }
}
