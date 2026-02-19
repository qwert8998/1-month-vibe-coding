using CustomerMangementAPI.Models;
using Microsoft.Extensions.Configuration;

namespace CustomerMangementAPI.Repositories
{
    public abstract class BaseRepository
    {
        protected readonly AppDbContext _dbContext;

        protected BaseRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
    }
}
