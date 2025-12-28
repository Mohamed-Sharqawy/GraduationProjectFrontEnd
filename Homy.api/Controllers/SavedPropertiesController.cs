using Homy.Application.Contract_Service.ApiServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Homy.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Requires authentication
    public class SavedPropertiesController : ControllerBase
    {
        private readonly ISavedPropertyApiService _savedPropertyService;

        public SavedPropertiesController(ISavedPropertyApiService savedPropertyService)
        {
            _savedPropertyService = savedPropertyService;
        }

        /// <summary>
        /// Get all saved properties for the authenticated user
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetMySavedProperties()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "User not authenticated" });

                var savedProperties = await _savedPropertyService.GetUserSavedPropertiesAsync(userId.Value);
                return Ok(savedProperties);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching saved properties", error = ex.Message });
            }
        }

        /// <summary>
        /// Save a property for the authenticated user
        /// </summary>
        /// <param name="propertyId">Property ID to save</param>
        [HttpPost("{propertyId}")]
        public async Task<IActionResult> SaveProperty(long propertyId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "User not authenticated" });

                var result = await _savedPropertyService.SavePropertyAsync(userId.Value, propertyId);
                
                if (!result)
                    return BadRequest(new { message = "Property not found or already saved" });

                return Ok(new { message = "Property saved successfully", propertyId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while saving property", error = ex.Message });
            }
        }

        /// <summary>
        /// Unsave (remove) a property for the authenticated user
        /// </summary>
        /// <param name="propertyId">Property ID to unsave</param>
        [HttpDelete("{propertyId}")]
        public async Task<IActionResult> UnsaveProperty(long propertyId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "User not authenticated" });

                var result = await _savedPropertyService.UnsavePropertyAsync(userId.Value, propertyId);
                
                if (!result)
                    return NotFound(new { message = "Saved property not found" });

                return Ok(new { message = "Property unsaved successfully", propertyId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while unsaving property", error = ex.Message });
            }
        }

        /// <summary>
        /// Check if a property is saved by the authenticated user
        /// </summary>
        /// <param name="propertyId">Property ID to check</param>
        [HttpGet("{propertyId}/is-saved")]
        public async Task<IActionResult> IsPropertySaved(long propertyId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "User not authenticated" });

                var isSaved = await _savedPropertyService.IsPropertySavedAsync(userId.Value, propertyId);
                
                return Ok(new { propertyId, isSaved });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while checking saved status", error = ex.Message });
            }
        }

        /// <summary>
        /// Toggle save/unsave property (Heart icon click)
        /// </summary>
        /// <param name="propertyId">Property ID to toggle</param>
        [HttpPost("{propertyId}/toggle")]
        public async Task<IActionResult> ToggleSaveProperty(long propertyId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "User not authenticated" });

                var isSaved = await _savedPropertyService.ToggleSavePropertyAsync(userId.Value, propertyId);
                
                var message = isSaved ? "Property saved successfully" : "Property unsaved successfully";
                
                return Ok(new { propertyId, isSaved, message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while toggling save status", error = ex.Message });
            }
        }

        /// <summary>
        /// Get current authenticated user's ID from JWT claims
        /// </summary>
        private Guid? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return null;

            if (Guid.TryParse(userIdClaim, out var userId))
                return userId;

            return null;
        }
    }
}
