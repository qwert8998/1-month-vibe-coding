using System.Collections.Generic;
using System.Threading.Tasks;
using CustomerMangementAPI.Repositories;

namespace CustomerMangementAPI.Services
{
    public class ClientService : IClientService
    {
        private readonly IClientRepository _clientRepository;

        public ClientService(IClientRepository clientRepository)
        {
            _clientRepository = clientRepository;
        }

        public async Task<List<string>> GetAllClientsAsync()
        {
            return await _clientRepository.GetAllClientsAsync();
        }

        public async Task CreateClientAsync(CustomerMangementAPI.Models.Client client)
        {
            await _clientRepository.CreateClientAsync(client);
        }

        public async Task<CustomerMangementAPI.Models.Client> GetClientByIdAsync(int clientId)
        {
            return await _clientRepository.GetClientByIdAsync(clientId);
        }

        public async Task<bool> UpdateClientAsync(int clientId, CustomerMangementAPI.Models.Client client)
        {
            return await _clientRepository.UpdateClientAsync(clientId, client);
        }

        public async Task<bool> SoftDeleteClientAsync(int clientId)
        {
            return await _clientRepository.SoftDeleteClientAsync(clientId);
        }
    }
}
