using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;
using CustomerMangementAPI.Controllers;
using CustomerMangementAPI.Models;
using CustomerMangementAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace CustomerMangementAPI.Tests
{
    public class UserControllerTest
    {
        [Fact]
        public async Task CreateUser_WhenAuthorizationHeaderMissing_ReturnsUnauthorized_AndDoesNotCallService()
        {
            var userServiceMock = new Mock<IUserService>();
            var controller = CreateController(userServiceMock, withAuthorizationHeader: false);
            var user = new User { UserId = 1, UserName = "john" };

            var result = await controller.CreateUser(user);

            var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("error", GetPropertyValue(unauthorized.Value, "status"));
            Assert.Equal("Unauthorized", GetPropertyValue(unauthorized.Value, "message"));
            userServiceMock.Verify(service => service.CreateUserAsync(It.IsAny<User>()), Times.Never);
        }

        [Fact]
        public async Task CreateUser_WhenAuthorizationHeaderExists_CreatesUserAndReturnsOk()
        {
            var userServiceMock = new Mock<IUserService>();
            var controller = CreateController(userServiceMock, withAuthorizationHeader: true);
            var user = new User { UserId = 2, UserName = "jane" };

            var result = await controller.CreateUser(user);

            Assert.IsType<OkResult>(result);
            userServiceMock.Verify(service => service.CreateUserAsync(user), Times.Once);
        }

        [Fact]
        public async Task ListAllUsers_WhenAuthorizationHeaderMissing_ReturnsUnauthorized_AndDoesNotCallService()
        {
            var userServiceMock = new Mock<IUserService>();
            var controller = CreateController(userServiceMock, withAuthorizationHeader: false);

            var result = await controller.ListAllUsers();

            var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("error", GetPropertyValue(unauthorized.Value, "status"));
            Assert.Equal("Unauthorized", GetPropertyValue(unauthorized.Value, "message"));
            userServiceMock.Verify(service => service.GetAllUsersAsync(), Times.Never);
        }

        [Fact]
        public async Task ListAllUsers_WhenAuthorizationHeaderExists_ReturnsUsers()
        {
            var userServiceMock = new Mock<IUserService>();
            var controller = CreateController(userServiceMock, withAuthorizationHeader: true);
            var users = new List<User>
            {
                new User { UserId = 1, UserName = "alice" },
                new User { UserId = 2, UserName = "bob" }
            };

            userServiceMock
                .Setup(service => service.GetAllUsersAsync())
                .ReturnsAsync(users);

            var result = await controller.ListAllUsers();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var payload = Assert.IsType<List<User>>(okResult.Value);
            Assert.Equal(2, payload.Count);
            userServiceMock.Verify(service => service.GetAllUsersAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateUser_WhenUserIdIsZero_ReturnsBadRequest_AndDoesNotCallService()
        {
            var userServiceMock = new Mock<IUserService>();
            var controller = new UserController(userServiceMock.Object);
            var user = new User { UserId = 0 };

            var result = await controller.UpdateUser(user);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("UserId is required", badRequest.Value);
            userServiceMock.Verify(
                service => service.UpdateUserAsync(It.IsAny<int>(), It.IsAny<User>()),
                Times.Never);
        }

        [Fact]
        public async Task UpdateUser_WhenServiceReturnsFalse_ReturnsNotFound()
        {
            var userServiceMock = new Mock<IUserService>();
            var controller = new UserController(userServiceMock.Object);
            var user = new User { UserId = 7 };

            userServiceMock
                .Setup(service => service.UpdateUserAsync(user.UserId, user))
                .ReturnsAsync(false);

            var result = await controller.UpdateUser(user);

            Assert.IsType<NotFoundResult>(result);
            userServiceMock.Verify(
                service => service.UpdateUserAsync(user.UserId, user),
                Times.Once);
        }

        [Fact]
        public async Task UpdateUser_WhenServiceReturnsTrue_ReturnsOk()
        {
            var userServiceMock = new Mock<IUserService>();
            var controller = new UserController(userServiceMock.Object);
            var user = new User { UserId = 12 };

            userServiceMock
                .Setup(service => service.UpdateUserAsync(user.UserId, user))
                .ReturnsAsync(true);

            var result = await controller.UpdateUser(user);

            Assert.IsType<OkResult>(result);
            userServiceMock.Verify(
                service => service.UpdateUserAsync(user.UserId, user),
                Times.Once);
        }

        [Fact]
        public async Task GetUserById_WhenUserDoesNotExist_ReturnsNotFound()
        {
            var userServiceMock = new Mock<IUserService>();
            var controller = CreateController(userServiceMock, withAuthorizationHeader: true);
            const int userId = 99;

            userServiceMock
                .Setup(service => service.GetUserByIdAsync(userId))
                .ReturnsAsync((User)null);

            var result = await controller.GetUserById(userId);

            Assert.IsType<NotFoundResult>(result);
            userServiceMock.Verify(service => service.GetUserByIdAsync(userId), Times.Once);
        }

        [Fact]
        public async Task GetUserById_WhenUserExists_ReturnsUser()
        {
            var userServiceMock = new Mock<IUserService>();
            var controller = CreateController(userServiceMock, withAuthorizationHeader: true);
            var expectedUser = new User { UserId = 5, UserName = "martin" };

            userServiceMock
                .Setup(service => service.GetUserByIdAsync(expectedUser.UserId))
                .ReturnsAsync(expectedUser);

            var result = await controller.GetUserById(expectedUser.UserId);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var payload = Assert.IsType<User>(okResult.Value);
            Assert.Equal(expectedUser.UserId, payload.UserId);
            Assert.Equal(expectedUser.UserName, payload.UserName);
            userServiceMock.Verify(service => service.GetUserByIdAsync(expectedUser.UserId), Times.Once);
        }

        private static UserController CreateController(Mock<IUserService> userServiceMock, bool withAuthorizationHeader)
        {
            var controller = new UserController(userServiceMock.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext()
                }
            };

            if (withAuthorizationHeader)
            {
                controller.Request.Headers["Authorization"] = "Bearer token";
            }

            return controller;
        }

        private static object GetPropertyValue(object source, string propertyName)
        {
            var property = source.GetType().GetProperty(propertyName, BindingFlags.Public | BindingFlags.Instance);
            return property?.GetValue(source);
        }
    }
}
