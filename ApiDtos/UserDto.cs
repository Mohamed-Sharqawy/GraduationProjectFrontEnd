using Homy.Domin.models;

namespace Homy.Application.Dtos.ApiDtos
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string? WhatsAppNumber { get; set; }
        public UserRole Role { get; set; }
        public bool IsVerified { get; set; }
        public string Token { get; set; } = null!;
    }
}
