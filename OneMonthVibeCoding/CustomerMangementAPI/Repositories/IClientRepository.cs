using System.Collections.Generic;
using System.Threading.Tasks;

namespace CustomerMangementAPI.Repositories
{
    public interface IClientRepository
    {
        Task<List<string>> GetAllClientsAsync();
    }
}
