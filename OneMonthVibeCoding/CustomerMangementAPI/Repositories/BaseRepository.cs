using CustomerMangementAPI.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using System;
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

        protected IQueryable<T> Query<T>(bool asNoTracking = false) where T : class
        {
            var query = _dbContext.Set<T>().AsQueryable();
            return asNoTracking ? query.AsNoTracking() : query;
        }

        protected async Task<int> SaveChangesAsync()
        {
            return await _dbContext.SaveChangesAsync();
        }

        protected async Task<bool> ExecuteForEntityByIdAsync<T>(object id, Action<T> action, bool requireNotDeleted = false) where T : class
        {
            var entity = await FindByIdInternalAsync<T>(id, requireNotDeleted);
            if (entity == null)
            {
                return false;
            }

            action(entity);
            await SaveChangesAsync();
            return true;
        }

        protected async Task<T> GetFirstOrDefaultAsync<T>(Func<IQueryable<T>, IQueryable<T>> queryBuilder) where T : class
        {
            var query = queryBuilder(Query<T>());
            return await query.FirstOrDefaultAsync();
        }

        // Generalized: Get all entities with custom property filter
        public async Task<List<T>> GetAllAsync<T>(bool filter = true, string propertyName = null, object propertyValue = null) where T : class
        {
            var query = Query<T>();
            if (filter && propertyName != null && typeof(T).GetProperty(propertyName) != null)
            {
                query = query.Where(e => object.Equals(EF.Property<object>(e, propertyName), propertyValue));
            }
            return await query.ToListAsync();
        }

        // Generic: Create entity
        public async Task CreateAsync<T>(T entity) where T : class
        {
            if (typeof(T).GetProperty("IsDeleted") != null)
                typeof(T).GetProperty("IsDeleted").SetValue(entity, false);
            await _dbContext.Set<T>().AddAsync(entity);
            await SaveChangesAsync();
        }

        // Generalized: Get entity by id with custom property filter
        public async Task<T> GetByIdAsync<T>(object id, string propertyName = null, object propertyValue = null) where T : class
        {
            var keyName = GetPrimaryKeyName<T>();
            var query = Query<T>();
            if (propertyName != null && typeof(T).GetProperty(propertyName) != null)
                query = query.Where(e => object.Equals(EF.Property<object>(e, propertyName), propertyValue));
            return await query.FirstOrDefaultAsync(e => object.Equals(EF.Property<object>(e, keyName), id));
        }

        // Generic: Update entity (virtual for custom mapping)
        public virtual async Task<bool> UpdateAsync<T>(object id, T updatedEntity) where T : class
        {
            return await ExecuteForEntityByIdAsync<T>(id, entity =>
            {
                _dbContext.Entry(entity).CurrentValues.SetValues(updatedEntity);
            }, requireNotDeleted: true);
        }

        private string GetPrimaryKeyName<T>() where T : class
        {
            return _dbContext.Model.FindEntityType(typeof(T)).FindPrimaryKey().Properties.First().Name;
        }

        private async Task<T> FindByIdInternalAsync<T>(object id, bool requireNotDeleted) where T : class
        {
            var keyName = GetPrimaryKeyName<T>();
            var query = Query<T>();

            if (requireNotDeleted && typeof(T).GetProperty("IsDeleted") != null)
            {
                query = query.Where(e => EF.Property<bool>(e, "IsDeleted") == false);
            }

            return await query.FirstOrDefaultAsync(e => object.Equals(EF.Property<object>(e, keyName), id));
        }
    }
}
