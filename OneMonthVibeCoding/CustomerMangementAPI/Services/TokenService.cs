using System;
using System.Collections.Concurrent;

namespace OneMonthVibeCoding.CustomerMangementAPI.Services
{
    public static class TokenService
    {
        // Simple in-memory token store for demo purposes
        private static ConcurrentDictionary<string, string> _userTokens = new ConcurrentDictionary<string, string>();

        public static string GenerateToken(string username)
        {
            var token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            _userTokens[token] = username;
            return token;
        }

        public static bool ValidateToken(string token)
        {
            return _userTokens.ContainsKey(token);
        }

        public static void InvalidateToken(string token)
        {
            _userTokens.TryRemove(token, out _);
        }

        public static string GetUsername(string token)
        {
            _userTokens.TryGetValue(token, out var username);
            return username;
        }
    }
}
