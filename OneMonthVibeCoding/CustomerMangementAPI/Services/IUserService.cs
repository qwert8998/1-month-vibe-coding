using System.Collections.Generic;
using System.Threading.Tasks;
using CustomerMangementAPI.Models;

namespace CustomerMangementAPI.Services
{
    public interface IUserService
    {
        Task CreateUserAsync(User user);
        Task<List<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(int userId);
        Task<bool> UpdateUserAsync(int userId, User user);
    }
}