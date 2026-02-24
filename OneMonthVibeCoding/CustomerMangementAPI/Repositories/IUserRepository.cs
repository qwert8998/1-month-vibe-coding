using System.Collections.Generic;
using System.Threading.Tasks;
using CustomerMangementAPI.Models;

namespace CustomerMangementAPI.Repositories
{
    public interface IUserRepository
    {
        Task CreateUserAsync(User user);
        Task<List<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(int userId);
        Task<User> GetUserByUsernameAsync(string username);
        Task<bool> UpdateUserAsync(int userId, User user);
    }
}