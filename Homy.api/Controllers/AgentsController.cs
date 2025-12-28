using Homy.Application.Contract_Service.ApiServices;
using Homy.Application.Dtos.ApiDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Homy.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgentsController : ControllerBase
    {
        private readonly IAgentApiService _agentService;

        public AgentsController(IAgentApiService agentService)
        {
            _agentService = agentService;
        }

        /// <summary>
        /// Get paginated and filtered agents/brokers
        /// </summary>
        /// <param name="filter">Filter and pagination parameters</param>
        /// <returns>Paginated list of agents</returns>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<PagedResultDto<AgentCardDto>>> GetAgents([FromQuery] AgentFilterDto filter)
        {
            try
            {
                var result = await _agentService.GetAgentsAsync(filter);
                
                // DEBUG: Log the result
                Console.WriteLine($"[AGENTS API] Returned {result.Items.Count} items out of {result.TotalCount} total");
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching agents", error = ex.Message });
            }
        }

        /// <summary>
        /// Get agent profile with their properties
        /// </summary>
        /// <param name="id">Agent ID (GUID)</param>
        /// <returns>Complete agent profile with properties</returns>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<AgentProfileDto>> GetAgentProfile(Guid id)
        {
            try
            {
                var agent = await _agentService.GetAgentProfileAsync(id);

                if (agent == null)
                    return NotFound(new { message = "Agent not found" });

                return Ok(agent);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching agent profile", error = ex.Message });
            }
        }

        /// <summary>
        /// Submit identity verification request (ID card photos + selfie)
        /// </summary>        
        [HttpPost("verify-identity")]
        [Authorize]
        public async Task<IActionResult> SubmitVerificationRequest([FromForm] VerificationRequestDto request)
        {
            try
            {
                // Get authenticated user ID
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                    return Unauthorized(new { message = "User not authenticated" });

                if (!ModelState.IsValid)
                    return BadRequest(new { message = "Invalid request data", errors = ModelState });

                var result = await _agentService.SubmitVerificationRequestAsync(userId, request);

                if (!result)
                    return NotFound(new { message = "User not found" });

                return Ok(new 
                { 
                    message = "Verification request submitted successfully. Your documents are under review.",
                    status = "pending"
                });
            }
            catch (InvalidOperationException ex)
            {
                // File validation errors
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while submitting verification", error = ex.Message });
            }
        }

        // ===== Profile Management Endpoints =====

        /// <summary>
        /// Get current user's profile
        /// </summary>
        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<AgentProfileDto>> GetMyProfile()
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                    return Unauthorized(new { message = "User not authenticated" });

                var profile = await _agentService.GetMyProfileAsync(userId);
                if (profile == null)
                    return NotFound(new { message = "Profile not found" });

                return Ok(profile);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Update agent profile
        /// </summary>
        [HttpPut("profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromForm] AgentProfileUpdateDto dto)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                    return Unauthorized(new { message = "User not authenticated" });

                var (success, message) = await _agentService.UpdateProfileAsync(userId, dto);

                if (!success)
                    return BadRequest(new { message });

                return Ok(new { message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Change password
        /// </summary>
        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                    return Unauthorized(new { message = "User not authenticated" });

                var (success, message) = await _agentService.ChangePasswordAsync(userId, dto);

                if (!success)
                    return BadRequest(new { message });

                return Ok(new { message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Get agent's properties (from PropertyApiService)
        /// </summary>
        [HttpGet("my-properties")]
        [Authorize]
        public async Task<IActionResult> GetMyProperties([FromQuery] PropertyFilterDto filter)
        {
            // This redirects to PropertiesController.GetMyProperties
            // But keeping it here for convenience
            return RedirectToAction("GetMyProperties", "Properties", filter);
        }
    }
}
