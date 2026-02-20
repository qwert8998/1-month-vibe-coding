using CustomerMangementAPI.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CustomerMangementAPI.Repositories
{
    public abstract class BaseRepository
    {
        protected readonly AppDbContext _dbContext;

        protected BaseRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Generalized: Get all entities with custom property filter
        public async Task<List<T>> GetAllAsync<T>(bool filter = true, string propertyName = null, object propertyValue = null) where T : class
        {
            var query = _dbContext.Set<T>().AsQueryable();
            if (filter && propertyName != null && typeof(T).GetProperty(propertyName) != null)
            {
                query = query.Where(e => EF.Property<object>(e, propertyName).Equals(propertyValue));
            }
            return await query.ToListAsync();
        }

        // Generic: Create entity
        public async Task CreateAsync<T>(T entity) where T : class
        {
            if (typeof(T).GetProperty("IsDeleted") != null)
                typeof(T).GetProperty("IsDeleted").SetValue(entity, false);
            await _dbContext.Set<T>().AddAsync(entity);
            await _dbContext.SaveChangesAsync();
        }

        // Generalized: Get entity by id with custom property filter
        public async Task<T> GetByIdAsync<T>(object id, string propertyName = null, object propertyValue = null) where T : class
        {
            var keyName = _dbContext.Model.FindEntityType(typeof(T)).FindPrimaryKey().Properties.First().Name;
            var query = _dbContext.Set<T>().AsQueryable();
            if (propertyName != null && typeof(T).GetProperty(propertyName) != null)
                query = query.Where(e => EF.Property<object>(e, propertyName).Equals(propertyValue));
            return await query.FirstOrDefaultAsync(e => EF.Property<object>(e, keyName).Equals(id));
        }

        // Generic: Update entity (virtual for custom mapping)
        public virtual async Task<bool> UpdateAsync<T>(object id, T updatedEntity) where T : class
        {
            var keyName = _dbContext.Model.FindEntityType(typeof(T)).FindPrimaryKey().Properties.First().Name;
            var entity = await _dbContext.Set<T>().FirstOrDefaultAsync(e => EF.Property<object>(e, keyName).Equals(id) && (typeof(T).GetProperty("IsDeleted") == null || (bool)EF.Property<object>(e, "IsDeleted") == false));
            if (entity == null)
                return false;
            _dbContext.Entry(entity).CurrentValues.SetValues(updatedEntity);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
