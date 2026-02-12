using System.Collections.Generic;
using System.Threading.Tasks;
using CustomerMangementAPI.Models;

namespace CustomerMangementAPI.Services
{
    public interface IClientService
    {
        Task<List<string>> GetAllClientsAsync();
        Task CreateClientAsync(Client client);
        Task<Client> GetClientByIdAsync(int clientId);
        Task<bool> UpdateClientAsync(int clientId, Client client);
        Task<bool> SoftDeleteClientAsync(int clientId);
    }
}
