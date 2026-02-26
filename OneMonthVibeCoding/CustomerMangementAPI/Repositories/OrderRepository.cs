using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CustomerMangementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CustomerMangementAPI.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDbContext _context;
        public OrderRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Order>> GetAllOrdersAsync()
        {
            return await _context.Orders
                .Include(o => o.Client)
                .Where(o => !o.IsDeleted)
                .ToListAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int orderId)
        {
            return await _context.Orders
                .Include(o => o.Client)
                .FirstOrDefaultAsync(o => o.OrderId == orderId && !o.IsDeleted);
        }

        public async Task<Order> CreateOrderAsync(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<Order> UpdateOrderAsync(Order order)
        {
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<bool> SoftDeleteOrderAsync(int orderId, string updateBy)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null || order.IsDeleted) return false;
            order.IsDeleted = true;
            order.UpdateBy = updateBy;
            order.UpdateDate = System.DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RefundOrderAsync(int orderId, decimal refundCost, string updateBy)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null || order.IsDeleted) return false;
            order.Refund = true;
            order.RefundCost = refundCost;
            order.UpdateBy = updateBy;
            order.UpdateDate = System.DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}