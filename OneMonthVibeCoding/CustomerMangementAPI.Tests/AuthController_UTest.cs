using System.Threading.Tasks;
using CustomerMangementAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using OneMonthVibeCoding.CustomerMangementAPI.Controllers;
using OneMonthVibeCoding.CustomerMangementAPI.Models;
using Xunit;

namespace CustomerMangementAPI.Tests
{
    public class AuthControllerTest
    {
        [Fact]
        public async Task Login_WhenUsernameContainsSqlInjectionPattern_ReturnsBadRequest_AndDoesNotCallService()
        {
            var userServiceMock = new Mock<IUserService>();
            var encryptionServiceMock = new Mock<IPasswordEncryptionService>();
            var controller = new AuthController(userServiceMock.Object, encryptionServiceMock.Object);
            var request = new LoginRequest
            {
                Username = "admin; DROP TABLE Users",
                Password = "password123"
            };

            var result = await controller.Login(request);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("error", GetPropertyValue(badRequest.Value, "status"));
            Assert.Equal("Invalid username input", GetPropertyValue(badRequest.Value, "message"));
            userServiceMock.Verify(service => service.GetUserByUsernameAsync(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public void Logout_WhenTokenContainsSqlInjectionPattern_ReturnsUnauthorized()
        {
            var userServiceMock = new Mock<IUserService>();
            var encryptionServiceMock = new Mock<IPasswordEncryptionService>();
            var controller = new AuthController(userServiceMock.Object, encryptionServiceMock.Object);

            var result = controller.Logout("Bearer abc; DROP TABLE Users");

            var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("error", GetPropertyValue(unauthorized.Value, "status"));
            Assert.Equal("Invalid token", GetPropertyValue(unauthorized.Value, "message"));
        }

        private static object GetPropertyValue(object source, string propertyName)
        {
            var property = source.GetType().GetProperty(propertyName);
            return property?.GetValue(source);
        }
    }
}
