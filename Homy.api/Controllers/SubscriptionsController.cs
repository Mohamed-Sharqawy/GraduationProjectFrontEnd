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
    public class SubscriptionsController : ControllerBase
    {
        private readonly ISubscriptionApiService _subscriptionService;

        public SubscriptionsController(ISubscriptionApiService subscriptionService)
        {
            _subscriptionService = subscriptionService;
        }

        /// <summary>
        /// Get all available subscription packages
        /// </summary>
        [HttpGet("packages")]
        public async Task<IActionResult> GetPackages()
        {
            try
            {
                var packages = await _subscriptionService.GetAvailablePackagesAsync();
                return Ok(packages);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching packages", error = ex.Message });
            }
        }

        /// <summary>
        /// Get current user's subscription status
        /// </summary>
        [HttpGet("status")]
        [Authorize]
        public async Task<IActionResult> GetSubscriptionStatus()
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                    return Unauthorized(new { message = "User not authenticated" });

                var status = await _subscriptionService.GetSubscriptionStatusAsync(userId);
                return Ok(status);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching subscription status", error = ex.Message });
            }
        }

        /// <summary>
        /// Create a PayPal order for a package subscription
        /// </summary>
        [HttpPost("create-order")]
        [Authorize]
        public async Task<IActionResult> CreatePayPalOrder([FromBody] CreatePayPalOrderDto request)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                    return Unauthorized(new { message = "User not authenticated" });

                var result = await _subscriptionService.CreatePayPalOrderAsync(userId, request.PackageId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating PayPal order", error = ex.Message });
            }
        }

        /// <summary>
        /// Capture PayPal payment after user approval and create subscription
        /// </summary>
        [HttpPost("capture-payment")]
        [Authorize]
        public async Task<IActionResult> CapturePayment([FromBody] CapturePayPalPaymentDto request)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                    return Unauthorized(new { message = "User not authenticated" });

                var (success, message) = await _subscriptionService.CapturePaymentAndSubscribeAsync(userId, request);
                
                if (success)
                    return Ok(new { success = true, message });
                else
                    return BadRequest(new { success = false, message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error processing payment", error = ex.Message });
            }
        }

        /// <summary>
        /// Check if user can add a property
        /// </summary>
        [HttpGet("can-add-property")]
        [Authorize]
        public async Task<IActionResult> CanAddProperty([FromQuery] bool isFeatured = false)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                    return Unauthorized(new { message = "User not authenticated" });

                var result = await _subscriptionService.CanAddPropertyAsync(userId, isFeatured);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error checking property limit", error = ex.Message });
            }
        }

        /// <summary>
        /// Process expiring subscriptions (for background job or admin)
        /// </summary>
        [HttpPost("process-expiring")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ProcessExpiringSubscriptions()
        {
            try
            {
                await _subscriptionService.ProcessExpiringSubscriptionsAsync();
                return Ok(new { message = "Processed expiring subscriptions" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error processing expiring subscriptions", error = ex.Message });
            }
        }

        /// <summary>
        /// Process expired subscriptions (for background job or admin)
        /// </summary>
        [HttpPost("process-expired")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ProcessExpiredSubscriptions()
        {
            try
            {
                await _subscriptionService.ProcessExpiredSubscriptionsAsync();
                return Ok(new { message = "Processed expired subscriptions" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error processing expired subscriptions", error = ex.Message });
            }
        }

        /// <summary>
        /// PayPal payment success callback - returns order info for capture
        /// </summary>
        [HttpGet("payment-success")]
        public IActionResult PaymentSuccess([FromQuery] string token, [FromQuery] string PayerID)
        {
            // This endpoint is called by PayPal after user approves payment
            // token = PayPal Order ID, PayerID = Payer's PayPal ID
            return Ok(new 
            { 
                message = "✅ تم الموافقة على الدفع! الآن قم بعمل capture-payment",
                payPalOrderId = token,
                payPalPayerId = PayerID,
                nextStep = "POST /api/subscriptions/capture-payment with this data"
            });
        }

        /// <summary>
        /// PayPal payment cancelled callback
        /// </summary>
        [HttpGet("payment-cancel")]
        public IActionResult PaymentCancel()
        {
            return Ok(new { message = "❌ تم إلغاء عملية الدفع" });
        }
    }
}
