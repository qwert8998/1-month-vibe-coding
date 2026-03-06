const AUTH_TOKEN_KEY = 'authToken';
const AUTH_TOKEN_EXPIRES_AT_KEY = 'authTokenExpiresAt';

export function clearAuthStorage() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_TOKEN_EXPIRES_AT_KEY);
}

const isTokenExpired = (): boolean => {
  const expiresAtRaw = localStorage.getItem(AUTH_TOKEN_EXPIRES_AT_KEY);
  if (!expiresAtRaw) {
    return true;
  }

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt)) {
    return true;
  }

  return Date.now() >= expiresAt;
};

// Utility to get Authorization header
export function getAuthHeaders() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token || isTokenExpired()) {
    clearAuthStorage();
    return undefined;
  }

  return { Authorization: token };
}
