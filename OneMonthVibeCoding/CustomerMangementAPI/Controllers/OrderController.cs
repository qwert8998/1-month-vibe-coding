using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CustomerMangementAPI.Models;
using CustomerMangementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using CustomerMangementAPI.Validation;

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
            if (!InputValidationHelper.IsPositiveId(id))
            {
                return BadRequest("id must be greater than 0.");
            }

            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null) return NotFound();
            return Ok(order);
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder([FromBody] Order order)
        {
            if (order == null)
            {
                return BadRequest("Order data is required.");
            }

            if (order.ClientId <= 0)
            {
                return BadRequest("ClientId must be greater than 0.");
            }

            if (!InputValidationHelper.TryValidateModelStringProperties(order, out var invalidProperty))
            {
                return BadRequest($"Invalid input detected in {invalidProperty}.");
            }

            var created = await _orderService.CreateOrderAsync(order);
            return CreatedAtAction(nameof(GetOrder), new { id = created.OrderId }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Order>> UpdateOrder(int id, [FromBody] Order order)
        {
            if (!InputValidationHelper.IsPositiveId(id))
            {
                return BadRequest("id must be greater than 0.");
            }

            if (order == null)
            {
                return BadRequest("Order data is required.");
            }

            if (id != order.OrderId) return BadRequest();

            if (!InputValidationHelper.TryValidateModelStringProperties(order, out var invalidProperty))
            {
                return BadRequest($"Invalid input detected in {invalidProperty}.");
            }

            var updated = await _orderService.UpdateOrderAsync(order);
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDeleteOrder(int id, [FromQuery] string updateBy)
        {
            if (!InputValidationHelper.IsPositiveId(id))
            {
                return BadRequest("id must be greater than 0.");
            }

            if (string.IsNullOrWhiteSpace(updateBy) || !InputValidationHelper.IsSafeString(updateBy))
            {
                return BadRequest("updateBy contains invalid input.");
            }

            var result = await _orderService.SoftDeleteOrderAsync(id, updateBy);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpPost("{id}/refund")]
        public async Task<IActionResult> RefundOrder(int id, [FromQuery] decimal refundCost, [FromQuery] string updateBy)
        {
            if (!InputValidationHelper.IsPositiveId(id))
            {
                return BadRequest("id must be greater than 0.");
            }

            if (!InputValidationHelper.IsNonNegativeAmount(refundCost))
            {
                return BadRequest("refundCost must be greater than or equal to 0.");
            }

            if (string.IsNullOrWhiteSpace(updateBy) || !InputValidationHelper.IsSafeString(updateBy))
            {
                return BadRequest("updateBy contains invalid input.");
            }

            var result = await _orderService.RefundOrderAsync(id, refundCost, updateBy);
            if (!result) return NotFound();
            return Ok();
        }
    }
}