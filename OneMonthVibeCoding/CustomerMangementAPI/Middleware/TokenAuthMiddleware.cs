using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using OneMonthVibeCoding.CustomerMangementAPI.Services;

namespace OneMonthVibeCoding.CustomerMangementAPI.Middleware
{
    public class TokenAuthMiddleware
    {
        private readonly RequestDelegate _next;

        public TokenAuthMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var path = context.Request.Path.Value?.ToLower();
            // Allow login/logout endpoints without token
            if (path != null && (path.Contains("/api/auth/login") || path.Contains("/api/auth/logout")))
            {
                await _next(context);
                return;
            }

            var token = context.Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(token) || !TokenService.ValidateToken(token))
            {
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync("{\"status\":\"error\",\"message\":\"Unauthorized\"}");
                return;
            }

            await _next(context);
        }
    }
}
