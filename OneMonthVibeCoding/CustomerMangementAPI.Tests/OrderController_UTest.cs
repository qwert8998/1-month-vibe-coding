using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CustomerMangementAPI.Controllers;
using CustomerMangementAPI.Models;
using CustomerMangementAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace CustomerMangementAPI.Tests
{
    public class OrderControllerTest
    {
        [Fact]
        public async Task GetOrders_WhenCalled_ReturnsOkWithOrders()
        {
            var orderServiceMock = new Mock<IOrderService>();
            var controller = new OrderController(orderServiceMock.Object);
            var orders = new List<Order>
            {
                new Order { OrderId = 1, ClientId = 10, TotalCost = 100m },
                new Order { OrderId = 2, ClientId = 11, TotalCost = 150m }
            };

            orderServiceMock
                .Setup(service => service.GetAllOrdersAsync())
                .ReturnsAsync(orders);

            var result = await controller.GetOrders();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var payload = Assert.IsAssignableFrom<IEnumerable<Order>>(okResult.Value);
            Assert.Equal(2, payload.Count());
            orderServiceMock.Verify(service => service.GetAllOrdersAsync(), Times.Once);
        }

        [Fact]
        public async Task GetOrder_WhenOrderDoesNotExist_ReturnsNotFound()
        {
            var orderServiceMock = new Mock<IOrderService>();
            var controller = new OrderController(orderServiceMock.Object);
            const int orderId = 99;

            orderServiceMock
                .Setup(service => service.GetOrderByIdAsync(orderId))
                .ReturnsAsync((Order)null);

            var result = await controller.GetOrder(orderId);

            Assert.IsType<NotFoundResult>(result.Result);
            orderServiceMock.Verify(service => service.GetOrderByIdAsync(orderId), Times.Once);
        }

        [Fact]
        public async Task GetOrder_WhenOrderExists_ReturnsOkWithOrder()
        {
            var orderServiceMock = new Mock<IOrderService>();
            var controller = new OrderController(orderServiceMock.Object);
            var expectedOrder = new Order { OrderId = 3, ClientId = 12, TotalCost = 230m };

            orderServiceMock
                .Setup(service => service.GetOrderByIdAsync(expectedOrder.OrderId))
                .ReturnsAsync(expectedOrder);

            var result = await controller.GetOrder(expectedOrder.OrderId);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var payload = Assert.IsType<Order>(okResult.Value);
            Assert.Equal(expectedOrder.OrderId, payload.OrderId);
            Assert.Equal(expectedOrder.TotalCost, payload.TotalCost);
            orderServiceMock.Verify(service => service.GetOrderByIdAsync(expectedOrder.OrderId), Times.Once);
        }

        [Fact]
        public async Task CreateOrder_WhenCalled_ReturnsCreatedAtActionWithOrder()
        {
            var orderServiceMock = new Mock<IOrderService>();
            var controller = new OrderController(orderServiceMock.Object);
            var inputOrder = new Order { ClientId = 15, TotalCost = 310m };
            var createdOrder = new Order { OrderId = 8, ClientId = 15, TotalCost = 310m };

            orderServiceMock
                .Setup(service => service.CreateOrderAsync(inputOrder))
                .ReturnsAsync(createdOrder);

            var result = await controller.CreateOrder(inputOrder);

            var createdAt = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(nameof(OrderController.GetOrder), createdAt.ActionName);
            Assert.Equal(createdOrder.OrderId, createdAt.RouteValues["id"]);
            var payload = Assert.IsType<Order>(createdAt.Value);
            Assert.Equal(createdOrder.OrderId, payload.OrderId);
            orderServiceMock.Verify(service => service.CreateOrderAsync(inputOrder), Times.Once);
        }

        [Fact]
        public async Task UpdateOrder_WhenRouteIdMismatch_ReturnsBadRequest_AndDoesNotCallService()
        {
            var orderServiceMock = new Mock<IOrderService>();
            var controller = new OrderController(orderServiceMock.Object);
            var order = new Order { OrderId = 7, ClientId = 11, TotalCost = 400m };

            var result = await controller.UpdateOrder(9, order);

            Assert.IsType<BadRequestResult>(result.Result);
            orderServiceMock.Verify(service => service.UpdateOrderAsync(It.IsAny<Order>()), Times.Never);
        }

        [Fact]
        public async Task UpdateOrder_WhenRouteIdMatches_ReturnsOkWithUpdatedOrder()
        {
            var orderServiceMock = new Mock<IOrderService>();
            var controller = new OrderController(orderServiceMock.Object);
            var order = new Order { OrderId = 5, ClientId = 20, TotalCost = 450m };
            var updated = new Order { OrderId = 5, ClientId = 20, TotalCost = 455m };

            orderServiceMock
                .Setup(service => service.UpdateOrderAsync(order))
                .ReturnsAsync(updated);

            var result = await controller.UpdateOrder(order.OrderId, order);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var payload = Assert.IsType<Order>(okResult.Value);
            Assert.Equal(updated.TotalCost, payload.TotalCost);
            orderServiceMock.Verify(service => service.UpdateOrderAsync(order), Times.Once);
        }

        [Fact]
        public async Task SoftDeleteOrder_WhenServiceReturnsFalse_ReturnsNotFound()
        {
            var orderServiceMock = new Mock<IOrderService>();
            var controller = new OrderController(orderServiceMock.Object);
            const int orderId = 11;
            const string updateBy = "tester";

            orderServiceMock
                .Setup(service => service.SoftDeleteOrderAsync(orderId, updateBy))
                .ReturnsAsync(false);

            var result = await controller.SoftDeleteOrder(orderId, updateBy);

            Assert.IsType<NotFoundResult>(result);
            orderServiceMock.Verify(service => service.SoftDeleteOrderAsync(orderId, updateBy), Times.Once);
        }

        [Fact]
        public async Task SoftDeleteOrder_WhenServiceReturnsTrue_ReturnsNoContent()
        {
            var orderServiceMock = new Mock<IOrderService>();
            var controller = new OrderController(orderServiceMock.Object);
            const int orderId = 12;
            const string updateBy = "admin";

            orderServiceMock
                .Setup(service => service.SoftDeleteOrderAsync(orderId, updateBy))
                .ReturnsAsync(true);

            var result = await controller.SoftDeleteOrder(orderId, updateBy);

            Assert.IsType<NoContentResult>(result);
            orderServiceMock.Verify(service => service.SoftDeleteOrderAsync(orderId, updateBy), Times.Once);
        }

        [Fact]
        public async Task RefundOrder_WhenServiceReturnsFalse_ReturnsNotFound()
        {
            var orderServiceMock = new Mock<IOrderService>();
            var controller = new OrderController(orderServiceMock.Object);
            const int orderId = 13;
            const decimal refundCost = 25m;
            const string updateBy = "tester";

            orderServiceMock
                .Setup(service => service.RefundOrderAsync(orderId, refundCost, updateBy))
                .ReturnsAsync(false);

            var result = await controller.RefundOrder(orderId, refundCost, updateBy);

            Assert.IsType<NotFoundResult>(result);
            orderServiceMock.Verify(service => service.RefundOrderAsync(orderId, refundCost, updateBy), Times.Once);
        }

        [Fact]
        public async Task RefundOrder_WhenServiceReturnsTrue_ReturnsOk()
        {
            var orderServiceMock = new Mock<IOrderService>();
            var controller = new OrderController(orderServiceMock.Object);
            const int orderId = 14;
            const decimal refundCost = 40m;
            const string updateBy = "admin";

            orderServiceMock
                .Setup(service => service.RefundOrderAsync(orderId, refundCost, updateBy))
                .ReturnsAsync(true);

            var result = await controller.RefundOrder(orderId, refundCost, updateBy);

            Assert.IsType<OkResult>(result);
            orderServiceMock.Verify(service => service.RefundOrderAsync(orderId, refundCost, updateBy), Times.Once);
        }

        [Fact]
        public async Task RefundOrder_WhenUpdateByContainsSqlInjectionPattern_ReturnsBadRequest_AndDoesNotCallService()
        {
            var orderServiceMock = new Mock<IOrderService>();
            var controller = new OrderController(orderServiceMock.Object);

            var result = await controller.RefundOrder(14, 40m, "admin; DROP TABLE Orders");

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("updateBy contains invalid input.", badRequest.Value);
            orderServiceMock.Verify(service => service.RefundOrderAsync(It.IsAny<int>(), It.IsAny<decimal>(), It.IsAny<string>()), Times.Never);
        }
    }
}
