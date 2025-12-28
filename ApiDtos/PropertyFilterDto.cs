namespace Homy.Application.Dtos.ApiDtos
{
    /// <summary>
    /// Property search and filter parameters
    /// </summary>
    public class PropertyFilterDto
    {
        // Purpose filter (Buy = 1, Rent = 2, Both = 3)
        public byte? Purpose { get; set; }
        
        // Location filters
        public long? CityId { get; set; }
        public long? DistrictId { get; set; }
        public long? ProjectId { get; set; }
        
        // Property type filter
        public long? PropertyTypeId { get; set; }
        
        // Price filters
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        
        // For rent price
        public decimal? MinRentPrice { get; set; }
        public decimal? MaxRentPrice { get; set; }
        
        // Area filter
        public int? MinArea { get; set; }
        public int? MaxArea { get; set; }
        
        // Rooms filter
        public byte? MinRooms { get; set; }
        public byte? MaxRooms { get; set; }
        
        // Bathrooms filter
        public byte? MinBathrooms { get; set; }
        
        // Status filter (0=PendingReview, 1=Active, 2=SoldOrRented, 3=Hidden, 4=Rejected)
        public byte? Status { get; set; }
        
        // Finishing type (0=None, 1=Semi, 2=Full)
        public byte? FinishingType { get; set; }
        
        // Featured only
        public bool? IsFeatured { get; set; }
        
        // Search term (searches in title and description)
        public string? SearchTerm { get; set; }
        
        // Pagination
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        
        // Sorting
        public string SortBy { get; set; } = "CreatedAt"; // CreatedAt, Price, Area, Featured
        public bool SortDescending { get; set; } = true;
    }
}
