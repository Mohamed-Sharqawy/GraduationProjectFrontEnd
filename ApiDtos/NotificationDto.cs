using Homy.Domin.models;
using System;

namespace Homy.Application.Dtos.ApiDtos
{
    public class NotificationDto
    {
        public long Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Message { get; set; }
        public string Type { get; set; } = null!; // NotificationType as string
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        
        // Optional property reference
        public long? PropertyId { get; set; }
        public string? PropertyTitle { get; set; }
    }
}
