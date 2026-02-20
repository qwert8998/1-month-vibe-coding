using System.Collections.Generic;
using System.Threading.Tasks;
using CustomerMangementAPI.Models;
using CustomerMangementAPI.Repositories;

namespace CustomerMangementAPI.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordEncryptionService _encryptionService;

        public UserService(IUserRepository userRepository, IPasswordEncryptionService encryptionService)
        {
            _userRepository = userRepository;
            _encryptionService = encryptionService;
        }

        public async Task CreateUserAsync(User user)
        {
            user.PasswordHash = _encryptionService.EncryptPassword(user.PasswordHash);
            await _userRepository.CreateUserAsync(user);
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllUsersAsync();
        }

        public async Task<User> GetUserByIdAsync(int userId)
        {
            return await _userRepository.GetUserByIdAsync(userId);
        }

        public async Task<bool> UpdateUserAsync(int userId, User user)
        {
            if (!string.IsNullOrEmpty(user.PasswordHash))
            {
                user.PasswordHash = _encryptionService.EncryptPassword(user.PasswordHash);
            }
            return await _userRepository.UpdateUserAsync(userId, user);
        }
    }
}