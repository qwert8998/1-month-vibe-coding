using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CustomerMangementAPI.Models;
using CustomerMangementAPI.Services;
using Microsoft.AspNetCore.Authorization;

namespace CustomerMangementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null) return NotFound();
            return Ok(order);
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder([FromBody] Order order)
        {
            var created = await _orderService.CreateOrderAsync(order);
            return CreatedAtAction(nameof(GetOrder), new { id = created.OrderId }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Order>> UpdateOrder(int id, [FromBody] Order order)
        {
            if (id != order.OrderId) return BadRequest();
            var updated = await _orderService.UpdateOrderAsync(order);
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDeleteOrder(int id, [FromQuery] string updateBy)
        {
            var result = await _orderService.SoftDeleteOrderAsync(id, updateBy);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpPost("{id}/refund")]
        public async Task<IActionResult> RefundOrder(int id, [FromQuery] decimal refundCost, [FromQuery] string updateBy)
        {
            var result = await _orderService.RefundOrderAsync(id, refundCost, updateBy);
            if (!result) return NotFound();
            return Ok();
        }
    }
}