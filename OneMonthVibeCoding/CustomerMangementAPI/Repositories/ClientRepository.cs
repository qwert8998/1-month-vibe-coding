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
            var query = _dbContext.Set<Client>().AsQueryable();
            var existingClient = await query.FirstOrDefaultAsync(c => EF.Property<object>(c, "ClientId").Equals(clientId));
            if (existingClient == null)
                return false;

            // Custom mapping for Client entity
            existingClient.ClientFirstName = client.ClientFirstName;
            existingClient.ClientLastName = client.ClientLastName;
            existingClient.PrefferName = client.PrefferName;
            existingClient.DateofBirth = client.DateofBirth;
            existingClient.UpdateBy = client.UpdateBy;
            existingClient.UpdateDate = client.UpdateDate;

            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SoftDeleteClientAsync(int clientId)
        {
            // SoftDeleteAsync is still entity-specific, but now filterable
            var query = _dbContext.Set<Client>().AsQueryable();
            var client = await query.FirstOrDefaultAsync(c => EF.Property<object>(c, "ClientId").Equals(clientId));
            if (client == null)
                return false;
            client.IsDeleted = true;
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
