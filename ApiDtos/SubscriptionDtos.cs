using System;

namespace Homy.Application.Dtos.ApiDtos
{
    /// <summary>
    /// Package display DTO
    /// </summary>
    public class PackageDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }
        public int DurationDays { get; set; }
        public int MaxProperties { get; set; }
        public int MaxFeatured { get; set; }
        public bool CanBumpUp { get; set; }
    }

    /// <summary>
    /// Request DTO to create PayPal order
    /// </summary>
    public class CreatePayPalOrderDto
    {
        public long PackageId { get; set; }
    }

    /// <summary>
    /// Response after creating PayPal order
    /// </summary>
    public class PayPalOrderResponse
    {
        public string OrderId { get; set; } = null!;
        public string ApprovalUrl { get; set; } = null!;
    }

    /// <summary>
    /// Request DTO to capture PayPal payment after user approves
    /// </summary>
    public class CapturePayPalPaymentDto
    {
        public long PackageId { get; set; }
        public string PayPalOrderId { get; set; } = null!;
        public string? PayPalPayerId { get; set; }
    }

    /// <summary>
    /// User's subscription status
    /// </summary>
    public class SubscriptionStatusDto
    {
        public bool HasActiveSubscription { get; set; }
        public string? PackageName { get; set; }
        public decimal? PackagePrice { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int DaysRemaining { get; set; }
        
        // Usage stats
        public int PropertiesUsed { get; set; }
        public int PropertiesLimit { get; set; }
        public int FeaturedUsed { get; set; }
        public int FeaturedLimit { get; set; }
        
        // Remaining
        public int PropertiesRemaining => PropertiesLimit - PropertiesUsed;
        public int FeaturedRemaining => FeaturedLimit - FeaturedUsed;
    }

    /// <summary>
    /// Check if user can add property
    /// </summary>
    public class CanAddPropertyDto
    {
        public bool CanAdd { get; set; }
        public string? ErrorMessage { get; set; }
        public string? ErrorCode { get; set; }
    }
}
