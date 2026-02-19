using System.Collections.Generic;
using System.Threading.Tasks;
using System.Data;
using Microsoft.Data.SqlClient;
using CustomerMangementAPI.Models;
using System;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CustomerMangementAPI.Repositories
{
    

    public class ClientRepository : BaseRepository, IClientRepository
    {
        private readonly AppDbContext _dbContext;

        public ClientRepository(AppDbContext dbContext)
            : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Client>> GetAllClientsAsync()
        {
            return await _dbContext.Set<Client>().Where(c => !c.IsDeleted).ToListAsync();
        }

        public async Task CreateClientAsync(Client client)
        {
            client.IsDeleted = false;
            await _dbContext.Set<Client>().AddAsync(client);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<Client> GetClientByIdAsync(int clientId)
        {
            return await _dbContext.Set<Client>().FirstOrDefaultAsync(c => c.ClientId == clientId && !c.IsDeleted);
        }

        public async Task<bool> UpdateClientAsync(int clientId, Client client)
        {
            var existingClient = await _dbContext.Set<Client>().FirstOrDefaultAsync(c => c.ClientId == clientId && !c.IsDeleted);
            if (existingClient == null)
                return false;

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
            var client = await _dbContext.Set<Client>().FirstOrDefaultAsync(c => c.ClientId == clientId && !c.IsDeleted);
            if (client == null)
                return false;

            client.IsDeleted = true;
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
