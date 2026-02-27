using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CustomerMangementAPI.Models;

namespace CustomerMangementAPI.Repositories
{
    public class UserRepository : BaseRepository, IUserRepository
    {
        public UserRepository(AppDbContext dbContext) : base(dbContext) { }

        public async Task CreateUserAsync(User user)
        {
            await CreateAsync(user);
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await GetAllAsync<User>(false);
        }

        public async Task<User> GetUserByIdAsync(int userId)
        {
            return await GetByIdAsync<User>(userId);
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(u => u.UserName == username);
        }

        public async Task<bool> UpdateUserAsync(int userId, User user)
        {
            return await UpdateAsync<User>(userId, user);
        }
    }
}