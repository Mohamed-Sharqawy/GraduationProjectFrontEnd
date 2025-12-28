using System;

namespace Homy.Application.Dtos.ApiDtos
{
    /// <summary>
    /// Saved property item for user's saved properties list
    /// </summary>
    public class SavedPropertyDto
    {
        public long SavedPropertyId { get; set; }
        public DateTime SavedAt { get; set; }
        
        // Property details
        public PropertyListItemDto Property { get; set; } = null!;
    }
}
