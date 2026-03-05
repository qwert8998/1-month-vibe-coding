using System;
using System.Collections.Concurrent;

namespace OneMonthVibeCoding.CustomerMangementAPI.Services
{
    public static class TokenService
    {
        // Simple in-memory token store for demo purposes
        private static readonly ConcurrentDictionary<string, string> _userTokens = new ConcurrentDictionary<string, string>();

        public static string GenerateToken(string username)
        {
            var token = CreateToken();
            _userTokens[token] = username;
            return token;
        }

        public static bool ValidateToken(string token)
        {
            if (IsTokenMissing(token))
            {
                return false;
            }

            return _userTokens.ContainsKey(token);
        }

        public static void InvalidateToken(string token)
        {
            if (IsTokenMissing(token))
            {
                return;
            }

            _userTokens.TryRemove(token, out _);
        }

        public static string GetUsername(string token)
        {
            if (IsTokenMissing(token))
            {
                return null;
            }

            _userTokens.TryGetValue(token, out var username);
            return username;
        }

        private static bool IsTokenMissing(string token)
        {
            return string.IsNullOrWhiteSpace(token);
        }

        private static string CreateToken()
        {
            return Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        }
    }
}
