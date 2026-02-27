using CustomerMangementAPI.Models;
using CustomerMangementAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OneMonthVibeCoding.CustomerMangementAPI.Models;
using System.Threading.Tasks;

namespace OneMonthVibeCoding.CustomerMangementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IPasswordEncryptionService _passwordEncryptionService;

        public AuthController(IUserService userService, IPasswordEncryptionService passwordEncryptionService)
        {
            _userService = userService;
            _passwordEncryptionService = passwordEncryptionService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userService.GetUserByUsernameAsync(request.Username);
            if (user == null)
            {
                return Unauthorized(new { status = "error", message = "Invalid credentials" });
            }

            var encryptedPassword = _passwordEncryptionService.EncryptPassword(request.Password);
            if (user.PasswordHash != encryptedPassword)
            {
                return Unauthorized(new { status = "error", message = "Invalid credentials" });
            }

            var token = Services.TokenService.GenerateToken(user.UserName);
            return Ok(new { status = "success", token });
        }

        [HttpPost("logout")]
        public IActionResult Logout([FromHeader(Name = "Authorization")] string token)
        {
            if (!Services.TokenService.ValidateToken(token))
            {
                return Unauthorized(new { status = "error", message = "Invalid token" });
            }
            Services.TokenService.InvalidateToken(token);
            return Ok(new { status = "success", message = "Logged out" });
        }
    }
}
