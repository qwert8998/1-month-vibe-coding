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
    public class ClientControllerTest
    {
        [Fact]
        public async Task GetAllClients_WhenAuthorizationHeaderMissing_ReturnsUnauthorized_AndDoesNotCallService()
        {
            var clientServiceMock = new Mock<IClientService>();
            var controller = CreateController(clientServiceMock, withAuthorizationHeader: false);

            var result = await controller.GetAllClients();

            var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result.Result);
            Assert.Equal("error", GetPropertyValue(unauthorized.Value, "status"));
            Assert.Equal("Unauthorized", GetPropertyValue(unauthorized.Value, "message"));
            clientServiceMock.Verify(service => service.GetAllClientsAsync(), Times.Never);
        }

        [Fact]
        public async Task GetAllClients_WhenAuthorizationHeaderExists_ReturnsOkWithClients()
        {
            var clientServiceMock = new Mock<IClientService>();
            var controller = CreateController(clientServiceMock, withAuthorizationHeader: true);
            var clients = new List<Client>
            {
                new Client { ClientId = 1, ClientFirstName = "Amy", ClientLastName = "Stone" },
                new Client { ClientId = 2, ClientFirstName = "Ben", ClientLastName = "River" }
            };

            clientServiceMock
                .Setup(service => service.GetAllClientsAsync())
                .ReturnsAsync(clients);

            var result = await controller.GetAllClients();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var payload = Assert.IsType<List<Client>>(okResult.Value);
            Assert.Equal(2, payload.Count);
            clientServiceMock.Verify(service => service.GetAllClientsAsync(), Times.Once);
        }

        [Fact]
        public async Task CreateClient_WhenAuthorizationHeaderMissing_ReturnsUnauthorized_AndDoesNotCallService()
        {
            var clientServiceMock = new Mock<IClientService>();
            var controller = CreateController(clientServiceMock, withAuthorizationHeader: false);
            var client = new Client { ClientId = 3, ClientFirstName = "Carl" };

            var result = await controller.CreateClient(client);

            var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("error", GetPropertyValue(unauthorized.Value, "status"));
            Assert.Equal("Unauthorized", GetPropertyValue(unauthorized.Value, "message"));
            clientServiceMock.Verify(service => service.CreateClientAsync(It.IsAny<Client>()), Times.Never);
        }

        [Fact]
        public async Task CreateClient_WhenClientIsNull_ReturnsBadRequest_AndDoesNotCallService()
        {
            var clientServiceMock = new Mock<IClientService>();
            var controller = CreateController(clientServiceMock, withAuthorizationHeader: true);

            var result = await controller.CreateClient(null);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Client data is required.", badRequest.Value);
            clientServiceMock.Verify(service => service.CreateClientAsync(It.IsAny<Client>()), Times.Never);
        }

        [Fact]
        public async Task CreateClient_WhenAuthorizationHeaderExistsAndClientIsValid_ReturnsOk()
        {
            var clientServiceMock = new Mock<IClientService>();
            var controller = CreateController(clientServiceMock, withAuthorizationHeader: true);
            var client = new Client { ClientId = 4, ClientFirstName = "Dora" };

            var result = await controller.CreateClient(client);

            Assert.IsType<OkResult>(result);
            clientServiceMock.Verify(service => service.CreateClientAsync(client), Times.Once);
        }

        [Fact]
        public async Task CreateClient_WhenClientFirstNameContainsSqlInjectionPattern_ReturnsBadRequest_AndDoesNotCallService()
        {
            var clientServiceMock = new Mock<IClientService>();
            var controller = CreateController(clientServiceMock, withAuthorizationHeader: true);
            var client = new Client { ClientId = 5, ClientFirstName = "Amy' UNION SELECT *" };

            var result = await controller.CreateClient(client);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid input detected in ClientFirstName.", badRequest.Value);
            clientServiceMock.Verify(service => service.CreateClientAsync(It.IsAny<Client>()), Times.Never);
        }

        [Fact]
        public async Task GetClientById_WhenClientDoesNotExist_ReturnsNotFound()
        {
            var clientServiceMock = new Mock<IClientService>();
            var controller = CreateController(clientServiceMock, withAuthorizationHeader: true);
            const int clientId = 25;

            clientServiceMock
                .Setup(service => service.GetClientByIdAsync(clientId))
                .ReturnsAsync((Client)null);

            var result = await controller.GetClientById(clientId);

            Assert.IsType<NotFoundResult>(result.Result);
            clientServiceMock.Verify(service => service.GetClientByIdAsync(clientId), Times.Once);
        }

        [Fact]
        public async Task GetClientById_WhenClientExists_ReturnsOkWithClient()
        {
            var clientServiceMock = new Mock<IClientService>();
            var controller = CreateController(clientServiceMock, withAuthorizationHeader: true);
            var expectedClient = new Client { ClientId = 6, ClientFirstName = "Eli", ClientLastName = "North" };

            clientServiceMock
                .Setup(service => service.GetClientByIdAsync(expectedClient.ClientId))
                .ReturnsAsync(expectedClient);

            var result = await controller.GetClientById(expectedClient.ClientId);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var payload = Assert.IsType<Client>(okResult.Value);
            Assert.Equal(expectedClient.ClientId, payload.ClientId);
            Assert.Equal(expectedClient.ClientFirstName, payload.ClientFirstName);
            clientServiceMock.Verify(service => service.GetClientByIdAsync(expectedClient.ClientId), Times.Once);
        }

        [Fact]
        public async Task UpdateClient_WhenClientIsNull_ReturnsBadRequest_AndDoesNotCallService()
        {
            var clientServiceMock = new Mock<IClientService>();
            var controller = CreateController(clientServiceMock, withAuthorizationHeader: true);

            var result = await controller.UpdateClient(7, null);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("Client data is required.", badRequest.Value);
            clientServiceMock.Verify(service => service.UpdateClientAsync(It.IsAny<int>(), It.IsAny<Client>()), Times.Never);
        }

        [Fact]
        public async Task UpdateClient_WhenClientIsValid_ReturnsOkWithResult()
        {
            var clientServiceMock = new Mock<IClientService>();
            var controller = CreateController(clientServiceMock, withAuthorizationHeader: true);
            var client = new Client { ClientId = 8, ClientFirstName = "Faye" };

            clientServiceMock
                .Setup(service => service.UpdateClientAsync(8, client))
                .ReturnsAsync(true);

            var result = await controller.UpdateClient(8, client);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var payload = Assert.IsType<bool>(okResult.Value);
            Assert.True(payload);
            clientServiceMock.Verify(service => service.UpdateClientAsync(8, client), Times.Once);
        }

        [Fact]
        public async Task SoftDeleteClient_WhenServiceReturnsFalse_ReturnsOkWithFalse()
        {
            var clientServiceMock = new Mock<IClientService>();
            var controller = CreateController(clientServiceMock, withAuthorizationHeader: true);
            const int clientId = 9;

            clientServiceMock
                .Setup(service => service.SoftDeleteClientAsync(clientId))
                .ReturnsAsync(false);

            var result = await controller.SoftDeleteClient(clientId);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var payload = Assert.IsType<bool>(okResult.Value);
            Assert.False(payload);
            clientServiceMock.Verify(service => service.SoftDeleteClientAsync(clientId), Times.Once);
        }

        [Fact]
        public async Task SoftDeleteClient_WhenServiceReturnsTrue_ReturnsOkWithTrue()
        {
            var clientServiceMock = new Mock<IClientService>();
            var controller = CreateController(clientServiceMock, withAuthorizationHeader: true);
            const int clientId = 10;

            clientServiceMock
                .Setup(service => service.SoftDeleteClientAsync(clientId))
                .ReturnsAsync(true);

            var result = await controller.SoftDeleteClient(clientId);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var payload = Assert.IsType<bool>(okResult.Value);
            Assert.True(payload);
            clientServiceMock.Verify(service => service.SoftDeleteClientAsync(clientId), Times.Once);
        }

        private static ClientController CreateController(Mock<IClientService> clientServiceMock, bool withAuthorizationHeader)
        {
            var controller = new ClientController(clientServiceMock.Object)
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
