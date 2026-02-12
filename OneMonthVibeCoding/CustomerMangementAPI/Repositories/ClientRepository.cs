using System.Collections.Generic;
using System.Threading.Tasks;

namespace CustomerMangementAPI.Repositories
{
    public class ClientRepository : IClientRepository
    {
        public async Task<List<string>> GetAllClientsAsync()
        {
            // Simulate async data fetch
            await Task.Delay(50);
            return new List<string> { "Alice", "Bob", "Charlie" };
        }

        public async Task CreateClientAsync(CustomerMangementAPI.Models.Client client)
        {
            // Simulate async client creation
            await Task.Delay(50);
            // In real implementation, add client to database here
        }

        public async Task<CustomerMangementAPI.Models.Client> GetClientByIdAsync(int clientId)
        {
            // Simulate async fetch
            await Task.Delay(50);
            // Return a dummy client for demonstration
            return new CustomerMangementAPI.Models.Client
            {
                ClientId = clientId,
                ClientFirstName = "John",
                ClientLastName = "Doe",
                PrefferName = "JD",
                DateofBirth = new System.DateTime(1990, 1, 1),
                CreateBy = "System",
                CreateDate = System.DateTime.UtcNow,
                UpdateBy = "System",
                UpdateDate = System.DateTime.UtcNow
            };
        }

        public async Task<bool> UpdateClientAsync(int clientId, CustomerMangementAPI.Models.Client client)
        {
            // Simulate async update
            await Task.Delay(50);
            // In real implementation, update client in database here
            return true; // Assume update always succeeds for now
        }

        public async Task<bool> SoftDeleteClientAsync(int clientId)
        {
            // Simulate async soft delete
            await Task.Delay(50);
            // In real implementation, mark client as deleted in database
            return true; // Assume delete always succeeds for now
        }
    }
}
