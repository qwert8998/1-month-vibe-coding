using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace CustomerMangementAPI.Services
{
    public interface IPasswordEncryptionService
    {
        string EncryptPassword(string plainTextPassword);
        string DecryptPassword(string encryptedPassword);
    }

    public class PasswordEncryptionService : IPasswordEncryptionService
    {
        // In production, store this key securely (e.g., environment variable, Azure Key Vault)
        private readonly byte[] _key = Encoding.UTF8.GetBytes("A1B2C3D4E5F6G7H8"); // 16 bytes for AES-128
        private readonly byte[] _iv = Encoding.UTF8.GetBytes("1H2G3F4E5D6C7B8A"); // 16 bytes

        public string EncryptPassword(string plainTextPassword)
        {
            using var aes = Aes.Create();
            aes.Key = _key;
            aes.IV = _iv;
            using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
            using var ms = new MemoryStream();
            using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
            using (var sw = new StreamWriter(cs))
            {
                sw.Write(plainTextPassword);
            }
            return Convert.ToBase64String(ms.ToArray());
        }

        public string DecryptPassword(string encryptedPassword)
        {
            using var aes = Aes.Create();
            aes.Key = _key;
            aes.IV = _iv;
            using var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
            var buffer = Convert.FromBase64String(encryptedPassword);
            using var ms = new MemoryStream(buffer);
            using var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);
            using var sr = new StreamReader(cs);
            return sr.ReadToEnd();
        }
    }
}