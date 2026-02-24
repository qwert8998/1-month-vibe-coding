using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CustomerMangementAPI.Models;
using CustomerMangementAPI.Services;

namespace CustomerMangementAPI.Controllers
{
    [ApiController]
    [Route("users")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("creation")]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            // Auth check handled by middleware, but explicit for clarity
            if (!Request.Headers.ContainsKey("Authorization"))
                return Unauthorized(new { status = "error", message = "Unauthorized" });
            await _userService.CreateUserAsync(user);
            return Ok();
        }

        [HttpGet("all-users")]
        public async Task<IActionResult> ListAllUsers()
        {
            if (!Request.Headers.ContainsKey("Authorization"))
                return Unauthorized(new { status = "error", message = "Unauthorized" });
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateUser([FromBody] User user)
        {
            if (user.UserId == 0)
                return BadRequest("UserId is required");
            var result = await _userService.UpdateUserAsync(user.UserId, user);
            if (!result)
                return NotFound();
            return Ok();
        }

        [HttpGet("user-detail")]
        public async Task<IActionResult> GetUserById([FromQuery] int userId)
        {
            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null)
                return NotFound();
            return Ok(user);
        }
    }
}