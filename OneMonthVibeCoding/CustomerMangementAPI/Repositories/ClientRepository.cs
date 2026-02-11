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
    }
}
