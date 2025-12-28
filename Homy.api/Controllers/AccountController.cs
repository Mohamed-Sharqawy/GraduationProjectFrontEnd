using Homy.Application.Dtos.ApiDtos;
using Homy.Application.Contract_Service;
using Homy.Domin.models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Homy.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ITokenService _tokenService;

        public AccountController(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            ITokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Check if role is Admin (not allowed)
            if (registerDto.Role == UserRole.Admin)
                return BadRequest(new { message = "لا يمكن التسجيل كمسؤول" });

            // Check if email already exists
            var existingUserByEmail = await _userManager.FindByEmailAsync(registerDto.Email);
            if (existingUserByEmail != null)
                return BadRequest(new { message = "البريد الإلكتروني مسجل بالفعل" });

            var existingUserByPhone = _userManager.Users.FirstOrDefault(u => u.PhoneNumber == registerDto.PhoneNumber);
            if (existingUserByPhone != null)
                return BadRequest(new { message = "رقم الهاتف مسجل بالفعل" });

            // Create new user
            var user = new User
            {
                UserName = registerDto.Email,
                Email = registerDto.Email,
                PhoneNumber = registerDto.PhoneNumber,
                FullName = registerDto.FullName,
                WhatsAppNumber = registerDto.WhatsAppNumber,
                IsVerified = false,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
                return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

            // Assign role based on UserRole enum
            string roleName = registerDto.Role switch
            {
                UserRole.Owner => "Owner",
                UserRole.Agent => "Agent",
                _ => "Owner"
            };

            await _userManager.AddToRoleAsync(user, roleName);

            // Generate token
            var token = await _tokenService.CreateToken(user);

            return Ok(new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                WhatsAppNumber = user.WhatsAppNumber,
                Role = registerDto.Role, // Return the requested role
                IsVerified = user.IsVerified,
                Token = token
            });
        }

        /// <summary>
        /// Login user with Email and password
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Find user by Email
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null)
                return Unauthorized(new { message = "البريد الإلكتروني أو كلمة المرور غير صحيحة" });

            // Check if user is active
            if (!user.IsActive)
                return Unauthorized(new { message = "حسابك غير مفعل، يرجى التواصل مع الإدارة" });

            // Check if user is deleted
            if (user.IsDeleted)
                return Unauthorized(new { message = "تم حذف هذا الحساب" });

            // Verify password
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded)
                return Unauthorized(new { message = "البريد الإلكتروني أو كلمة المرور غير صحيحة" });

            // Determine role for response (since we removed Role property from User)
            var roles = await _userManager.GetRolesAsync(user);
            // Default to Owner if no role found, or map string to Enum
            UserRole userRole = UserRole.Owner;
            if (roles.Contains("Agent")) userRole = UserRole.Agent;
            if (roles.Contains("Admin")) userRole = UserRole.Admin;

            // Generate token
            var token = await _tokenService.CreateToken(user);

            return Ok(new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                WhatsAppNumber = user.WhatsAppNumber,
                Role = userRole,
                IsVerified = user.IsVerified,
                Token = token
            });
        }

        /// <summary>
        /// Get current user info (requires authentication)
        /// </summary>
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound(new { message = "المستخدم غير موجود" });

            var roles = await _userManager.GetRolesAsync(user);
            UserRole userRole = UserRole.Owner;
            if (roles.Contains("Agent")) userRole = UserRole.Agent;
            if (roles.Contains("Admin")) userRole = UserRole.Admin;

            var token = await _tokenService.CreateToken(user);

            return Ok(new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                WhatsAppNumber = user.WhatsAppNumber,
                Role = userRole,
                IsVerified = user.IsVerified,
                Token = token
            });
        }
    }
}
