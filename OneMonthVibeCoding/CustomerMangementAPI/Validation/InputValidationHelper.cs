using System.Reflection;
using System.Text.RegularExpressions;

namespace CustomerMangementAPI.Validation
{
    public static class InputValidationHelper
    {
        private static readonly Regex SqlInjectionPattern = new Regex(
            @"(--|;|/\*|\*/|\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE)?|INSERT|MERGE|SELECT|UNION|UPDATE|XP_)\b)",
            RegexOptions.Compiled | RegexOptions.IgnoreCase);

        public static bool IsPositiveId(int id)
        {
            return id > 0;
        }

        public static bool IsNonNegativeAmount(decimal amount)
        {
            return amount >= 0;
        }

        public static bool IsSafeString(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return true;
            }

            return !SqlInjectionPattern.IsMatch(value.Trim());
        }

        public static bool TryValidateModelStringProperties(object model, out string invalidProperty)
        {
            invalidProperty = string.Empty;

            if (model == null)
            {
                return true;
            }

            var properties = model.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (var property in properties)
            {
                if (property.PropertyType != typeof(string))
                {
                    continue;
                }

                var value = property.GetValue(model) as string;
                if (!IsSafeString(value))
                {
                    invalidProperty = property.Name;
                    return false;
                }
            }

            return true;
        }
    }
}