using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Homy.Application.Dtos.ApiDtos
{
    public class VerificationRequestDto
    {
        [Required(ErrorMessage = "Please upload ID Card Front image")]
        public IFormFile IdCardFront { get; set; } = null!;

        [Required(ErrorMessage = "Please upload ID Card Back image")]
        public IFormFile IdCardBack { get; set; } = null!;

        [Required(ErrorMessage = "Please upload Selfie with ID Card")]
        public IFormFile SelfieWithId { get; set; } = null!;
    }
}
