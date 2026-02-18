using Microsoft.Extensions.Configuration;

namespace CustomerMangementAPI.Repositories
{
    public abstract class BaseRepository
    {
        protected readonly string _connectionString = "Server=(localdb)\\mssqllocaldb;Database=OneMonthVibeCoding;Integrated Security=true;Trusted_Connection=True;MultipleActiveResultSets=true;";

        protected BaseRepository(IConfiguration configuration)
        {
            // _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
    }
}
