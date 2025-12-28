namespace Homy.Application.Dtos.ApiDtos
{
    /// <summary>
    /// Agent search and filter parameters
    /// </summary>
    public class AgentFilterDto
    {
        // Search by name
        public string? SearchTerm { get; set; }
        
        // Filter by location (agents who have properties in this city)
        public long? CityId { get; set; }
        
        // Filter by purpose (agents who have properties for sale/rent)
        public byte? Purpose { get; set; } // 1=ForSale, 2=ForRent
        
        // Only verified agents
        public bool? IsVerified { get; set; }
        
        // Pagination
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        
        // Sorting
        public string SortBy { get; set; } = "ActivePropertiesCount"; // ActivePropertiesCount, FullName, CreatedAt
        public bool SortDescending { get; set; } = true;
    }
}
