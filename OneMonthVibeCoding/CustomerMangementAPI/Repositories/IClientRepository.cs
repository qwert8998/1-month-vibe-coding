using System.Collections.Generic;
using System.Threading.Tasks;
using CustomerMangementAPI.Models;

namespace CustomerMangementAPI.Repositories
{
    public interface IClientRepository
    {
        Task<List<Client>> GetAllClientsAsync();
        Task CreateClientAsync(Client client);
        Task<Client> GetClientByIdAsync(int clientId);
        Task<bool> UpdateClientAsync(int clientId, Client client);
        Task<bool> SoftDeleteClientAsync(int clientId);
    }
}
