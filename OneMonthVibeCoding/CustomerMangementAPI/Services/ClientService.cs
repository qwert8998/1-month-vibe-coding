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
    }
}
