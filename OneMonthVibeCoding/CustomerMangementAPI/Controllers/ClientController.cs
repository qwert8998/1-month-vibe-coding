using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CustomerMangementAPI.Services;
using CustomerMangementAPI.Models;

namespace CustomerMangementAPI.Controllers
{
    [ApiController]
    [Route("client")]
    public class ClientController : ControllerBase
    {
        private readonly IClientService _clientService;

        public ClientController(IClientService clientService)
        {
            _clientService = clientService;
        }

        // GET: /client/get-clients
        [HttpGet("get-clients")]
        public async Task<ActionResult<IEnumerable<Client>>> GetAllClients()
        {
            var clients = await _clientService.GetAllClientsAsync();
            return Ok(clients);
        }

        // POST: /client/create-client
        [HttpPost("create-client")]
        public async Task<ActionResult> CreateClient([FromBody] Client client)
        {
            if (client == null)
            {
                return BadRequest("Client data is required.");
            }
            await _clientService.CreateClientAsync(client);
            return Ok();
        }

        // GET: /client/customer/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Client>> GetClientById(int id)
        {
            var client = await _clientService.GetClientByIdAsync(id);
            if (client == null)
            {
                return NotFound();
            }
            return Ok(client);
        }

        // PUT: /client/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<bool>> UpdateClient(int id, [FromBody] Client client)
        {
            if (client == null)
            {
                return BadRequest("Client data is required.");
            }
            var result = await _clientService.UpdateClientAsync(id, client);
            return Ok(result);
        }

        // DELETE: /client/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> SoftDeleteClient(int id)
        {
            var result = await _clientService.SoftDeleteClientAsync(id);
            return Ok(result);
        }
    }
}
