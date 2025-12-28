using Homy.Domin.models;
using System.ComponentModel.DataAnnotations;

namespace Homy.Application.Dtos.ApiDtos
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "الاسم الكامل مطلوب")]
        [MaxLength(200, ErrorMessage = "الاسم الكامل لا يمكن أن يزيد عن 200 حرف")]
        public string FullName { get; set; } = null!;

        [Required(ErrorMessage = "البريد الإلكتروني مطلوب")]
        [EmailAddress(ErrorMessage = "صيغة البريد الإلكتروني غير صحيحة")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "رقم الهاتف مطلوب")]
        [Phone(ErrorMessage = "رقم الهاتف غير صالح")]
        public string PhoneNumber { get; set; } = null!;

        [Phone(ErrorMessage = "رقم الواتساب غير صالح")]
        public string? WhatsAppNumber { get; set; }

        [Required(ErrorMessage = "كلمة المرور مطلوبة")]
        [MinLength(6, ErrorMessage = "كلمة المرور يجب أن تكون 6 أحرف على الأقل")]
        public string Password { get; set; } = null!;

        [Required(ErrorMessage = "تأكيد كلمة المرور مطلوب")]
        [Compare("Password", ErrorMessage = "كلمة المرور وتأكيدها غير متطابقين")]
        public string ConfirmPassword { get; set; } = null!;

        [Required(ErrorMessage = "نوع الحساب مطلوب")]
        public UserRole Role { get; set; } // Owner = 1, Agent = 2
    }
}
