const SQL_INJECTION_PATTERNS: RegExp[] = [
  /(--|#|\/\*|\*\/|;)/i,
  /\b(union\s+all\s+select|union\s+select)\b/i,
  /\b(drop|truncate|alter|exec(?:ute)?|xp_cmdshell)\b/i,
  /\b(or|and)\b\s+['"`\w]+\s*=\s*['"`\w]+/i,
];

const SQL_INJECTION_MESSAGE = 'Input contains potentially unsafe SQL patterns.';

export const containsSqlInjectionRisk = (value: string): boolean => {
  const normalizedValue = value.trim();
  if (!normalizedValue) {
    return false;
  }

  return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(normalizedValue));
};

export const validateSafeTextInput = (value: string, fieldName: string): string | null => {
  if (containsSqlInjectionRisk(value)) {
    return `${fieldName}: ${SQL_INJECTION_MESSAGE}`;
  }

  return null;
};

export const parseStrictPositiveInteger = (value: string, fieldName: string): number => {
  const normalizedValue = value.trim();
  if (!/^\d+$/.test(normalizedValue)) {
    throw new Error(`${fieldName} must be a positive integer.`);
  }

  const parsedValue = Number(normalizedValue);
  if (!Number.isSafeInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`${fieldName} must be a positive integer.`);
  }

  return parsedValue;
};

export const validatePositiveInteger = (value: number, fieldName: string): void => {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${fieldName} must be a positive integer.`);
  }
};

export const validateNonNegativeNumber = (value: number, fieldName: string): void => {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${fieldName} must be a non-negative number.`);
  }
};