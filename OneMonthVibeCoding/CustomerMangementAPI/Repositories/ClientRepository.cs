using CustomerMangementAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CustomerMangementAPI.Repositories
{
    public class ClientRepository : BaseRepository, IClientRepository
    {
        public ClientRepository(AppDbContext dbContext)
            : base(dbContext)
        {
        }

        public async Task<List<Client>> GetAllClientsAsync()
        {
            return await GetAllAsync<Client>(true, "IsDeleted", false);
        }

        public async Task CreateClientAsync(Client client)
        {
            await CreateAsync(client);
        }

        public async Task<Client> GetClientByIdAsync(int clientId)
        {
            return await GetByIdAsync<Client>(clientId);
        }

        public async Task<bool> UpdateClientAsync(int clientId, Client client)
        {
            return await ExecuteForEntityByIdAsync<Client>(clientId, existingClient =>
            {
                existingClient.ClientFirstName = client.ClientFirstName;
                existingClient.ClientLastName = client.ClientLastName;
                existingClient.PrefferName = client.PrefferName;
                existingClient.DateofBirth = client.DateofBirth;
                existingClient.UpdateBy = client.UpdateBy;
                existingClient.UpdateDate = client.UpdateDate;
            });
        }

        public async Task<bool> SoftDeleteClientAsync(int clientId)
        {
            return await ExecuteForEntityByIdAsync<Client>(clientId, client =>
            {
                client.IsDeleted = true;
            });
        }
    }
}
