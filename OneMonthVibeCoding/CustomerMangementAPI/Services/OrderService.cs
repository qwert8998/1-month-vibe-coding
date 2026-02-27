using System.Collections.Generic;
using System.Threading.Tasks;
using CustomerMangementAPI.Models;
using CustomerMangementAPI.Repositories;

namespace CustomerMangementAPI.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        public OrderService(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<IEnumerable<Order>> GetAllOrdersAsync()
        {
            return await _orderRepository.GetAllOrdersAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int orderId)
        {
            return await _orderRepository.GetOrderByIdAsync(orderId);
        }

        public async Task<Order> CreateOrderAsync(Order order)
        {
            return await _orderRepository.CreateOrderAsync(order);
        }

        public async Task<Order> UpdateOrderAsync(Order order)
        {
            return await _orderRepository.UpdateOrderAsync(order);
        }

        public async Task<bool> SoftDeleteOrderAsync(int orderId, string updateBy)
        {
            return await _orderRepository.SoftDeleteOrderAsync(orderId, updateBy);
        }

        public async Task<bool> RefundOrderAsync(int orderId, decimal refundCost, string updateBy)
        {
            return await _orderRepository.RefundOrderAsync(orderId, refundCost, updateBy);
        }
    }
}