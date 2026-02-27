// Utility to get Authorization header
export function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: token } : undefined;
}
