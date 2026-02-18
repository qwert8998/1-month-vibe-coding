using System.Collections.Generic;
using System.Threading.Tasks;
using System.Data;
using Microsoft.Data.SqlClient;
using Dapper;
using CustomerMangementAPI.Models;
using System;

namespace CustomerMangementAPI.Repositories
{
    

    public class ClientRepository : BaseRepository, IClientRepository
    {
        public ClientRepository(Microsoft.Extensions.Configuration.IConfiguration configuration)
            : base(configuration)
        {
        }

        public async Task<List<Client>> GetAllClientsAsync()
        {            
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new Exception("Database connection string is not set. Please check your configuration.");

            using var connection = new SqlConnection("Server=(localdb)\\mssqllocaldb;Database=OneMonthVibeCoding;Integrated Security=true;Trusted_Connection=True;MultipleActiveResultSets=true;");
            var sql = "SELECT * FROM dbo.Clients";
            var clients = await connection.QueryAsync<Client>(sql);
            return clients.AsList();
        }

        public async Task CreateClientAsync(Client client)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"INSERT INTO Clients (ClientFirstName, ClientLastName, PrefferName, DateofBirth, CreateBy, CreateDate, UpdateBy, UpdateDate, IsDeleted)
                        VALUES (@ClientFirstName, @ClientLastName, @PrefferName, @DateofBirth, @CreateBy, @CreateDate, @UpdateBy, @UpdateDate, 0)";
            await connection.ExecuteAsync(sql, client);
        }

        public async Task<Client> GetClientByIdAsync(int clientId)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "SELECT * FROM Clients WHERE ClientId = @ClientId AND IsDeleted = 0";
            return await connection.QueryFirstOrDefaultAsync<Client>(sql, new { ClientId = clientId });
        }

        public async Task<bool> UpdateClientAsync(int clientId, Client client)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"UPDATE Clients SET
                            ClientFirstName = @ClientFirstName,
                            ClientLastName = @ClientLastName,
                            PrefferName = @PrefferName,
                            DateofBirth = @DateofBirth,
                            UpdateBy = @UpdateBy,
                            UpdateDate = @UpdateDate
                        WHERE ClientId = @ClientId AND IsDeleted = 0";
            var affected = await connection.ExecuteAsync(sql, new {
                client.ClientFirstName,
                client.ClientLastName,
                client.PrefferName,
                client.DateofBirth,
                client.UpdateBy,
                client.UpdateDate,
                ClientId = clientId
            });
            return affected > 0;
        }

        public async Task<bool> SoftDeleteClientAsync(int clientId)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "UPDATE Clients SET IsDeleted = 1 WHERE ClientId = @ClientId AND IsDeleted = 0";
            var affected = await connection.ExecuteAsync(sql, new { ClientId = clientId });
            return affected > 0;
        }
    }
}
