using Homy.Application.Contract_Service.ApiServices;
using Homy.Application.Dtos.ApiDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Homy.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyApiService _propertyService;

        public PropertiesController(IPropertyApiService propertyService)
        {
            _propertyService = propertyService;
        }

        /// <summary>
        /// Get paginated and filtered properties
        /// </summary>
        /// <param name="filter">Filter and pagination parameters</param>
        /// <returns>Paginated list of properties</returns>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<PagedResultDto<PropertyListItemDto>>> GetProperties([FromQuery] PropertyFilterDto filter)
        {
            try
            {
                var result = await _propertyService.GetPropertiesAsync(filter);
                return Ok(result);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching properties", error = ex.Message });
            }
        }

        /// <summary>
        /// Get property details by ID
        /// </summary>
        /// <param name="id">Property ID</param>
        /// <returns>Complete property details</returns>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<PropertyDetailsDto>> GetPropertyById(long id)
        {
            try
            {
                var property = await _propertyService.GetPropertyByIdAsync(id);
                
                if (property == null)
                    return NotFound(new { message = "Property not found" });

                return Ok(property);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching property details", error = ex.Message });
            }
        }

        /// <summary>
        /// Increment property view count
        /// </summary>
        /// <param name="id">Property ID</param>
        [HttpPost("{id}/view")]
        [AllowAnonymous]
        public async Task<IActionResult> IncrementViewCount(long id)
        {
            try
            {
                await _propertyService.IncrementViewCountAsync(id);
                return Ok(new { message = "View count incremented" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Track WhatsApp click
        /// </summary>
        /// <param name="id">Property ID</param>
        [HttpPost("{id}/whatsapp-click")]
        [AllowAnonymous]
        public async Task<IActionResult> IncrementWhatsAppClick(long id)
        {
            try
            {
                await _propertyService.IncrementWhatsAppClickAsync(id);
                return Ok(new { message = "WhatsApp click tracked" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Track phone click
        /// </summary>
        /// <param name="id">Property ID</param>
        [HttpPost("{id}/phone-click")]
        [AllowAnonymous]
        public async Task<IActionResult> IncrementPhoneClick(long id)
        {
            try
            {
                await _propertyService.IncrementPhoneClickAsync(id);
                return Ok(new { message = "Phone click tracked" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        // ===== NEW: Property Management Endpoints =====

        /// <summary>
        /// Create a new property (requires authentication and subscription)
        /// </summary>
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateProperty([FromForm] CreatePropertyDto dto)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !System.Guid.TryParse(userIdClaim, out var userId))
                    return Unauthorized(new { message = "User not authenticated" });

                var (success, message, propertyId) = await _propertyService.CreatePropertyAsync(userId, dto);

                if (!success)
                    return BadRequest(new { message });

                return Ok(new { message, propertyId });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Admin: Approve or reject a property
        /// </summary>
        [HttpPost("approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveOrRejectProperty([FromBody] PropertyApprovalDto dto)
        {
            try
            {
                var (success, message) = await _propertyService.ApproveOrRejectPropertyAsync(dto);

                if (!success)
                    return BadRequest(new { message });

                return Ok(new { message });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Update property (requires ownership)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateProperty(long id, [FromForm] UpdatePropertyDto dto)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !System.Guid.TryParse(userIdClaim, out var userId))
                    return Unauthorized(new { message = "User not authenticated" });

                var (success, message) = await _propertyService.UpdatePropertyAsync(userId, id, dto);

                if (!success)
                    return BadRequest(new { message });

                return Ok(new { message });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete property (soft delete, requires ownership)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProperty(long id)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !System.Guid.TryParse(userIdClaim, out var userId))
                    return Unauthorized(new { message = "User not authenticated" });

                var success = await _propertyService.DeletePropertyAsync(userId, id);

                if (!success)
                    return NotFound(new { message = "Property not found or you don't have permission" });

                return Ok(new { message = "تم حذف الإعلان بنجاح" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Get my properties (requires authentication)
        /// </summary>
        [HttpGet("my-properties")]
        [Authorize]
        public async Task<ActionResult<PagedResultDto<PropertyCardDto>>> GetMyProperties([FromQuery] PropertyFilterDto filter)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !System.Guid.TryParse(userIdClaim, out var userId))
                    return Unauthorized(new { message = "User not authenticated" });

                var result = await _propertyService.GetUserPropertiesAsync(userId, filter);
                return Ok(result);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }
    }
}
