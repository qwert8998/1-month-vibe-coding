using System.Collections.Generic;
using System.Threading.Tasks;

namespace CustomerMangementAPI.Services
{
    public interface IClientService
    {
        Task<List<string>> GetAllClientsAsync();
    }
}
