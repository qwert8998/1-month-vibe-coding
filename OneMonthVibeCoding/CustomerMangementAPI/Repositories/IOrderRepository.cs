using System.Collections.Generic;
using System.Threading.Tasks;
using CustomerMangementAPI.Models;

namespace CustomerMangementAPI.Repositories
{
    public interface IOrderRepository
    {
        Task<IEnumerable<Order>> GetAllOrdersAsync();
        Task<Order> GetOrderByIdAsync(int orderId);
        Task<Order> CreateOrderAsync(Order order);
        Task<Order> UpdateOrderAsync(Order order);
        Task<bool> SoftDeleteOrderAsync(int orderId, string updateBy);
        Task<bool> RefundOrderAsync(int orderId, decimal refundCost, string updateBy);
    }
}