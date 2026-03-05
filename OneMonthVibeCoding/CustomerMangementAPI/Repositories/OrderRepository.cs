using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CustomerMangementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CustomerMangementAPI.Repositories
{
    public class OrderRepository : BaseRepository, IOrderRepository
    {
        public OrderRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Order>> GetAllOrdersAsync()
        {
            return await Query<Order>(asNoTracking: true)
                .Include(o => o.Client)
                .Where(o => !o.IsDeleted)
                .ToListAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int orderId)
        {
            return await Query<Order>(asNoTracking: true)
                .Include(o => o.Client)
                .FirstOrDefaultAsync(o => o.OrderId == orderId && !o.IsDeleted);
        }

        public async Task<Order> CreateOrderAsync(Order order)
        {
            _dbContext.Orders.Add(order);
            await SaveChangesAsync();
            return order;
        }

        public async Task<Order> UpdateOrderAsync(Order order)
        {
            _dbContext.Orders.Update(order);
            await SaveChangesAsync();
            return order;
        }

        public async Task<bool> SoftDeleteOrderAsync(int orderId, string updateBy)
        {
            return await ExecuteForEntityByIdAsync<Order>(orderId, order =>
            {
                order.IsDeleted = true;
                order.UpdateBy = updateBy;
                order.UpdateDate = System.DateTime.UtcNow;
            }, requireNotDeleted: true);
        }

        public async Task<bool> RefundOrderAsync(int orderId, decimal refundCost, string updateBy)
        {
            return await ExecuteForEntityByIdAsync<Order>(orderId, order =>
            {
                order.Refund = true;
                order.RefundCost = refundCost;
                order.UpdateBy = updateBy;
                order.UpdateDate = System.DateTime.UtcNow;
            }, requireNotDeleted: true);
        }
    }
}