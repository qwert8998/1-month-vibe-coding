// Auth API utilities
export async function login(username: string, password: string) {
  const response = await fetch('/api/Auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json();
}

export async function logout(token: string) {
  return fetch('/api/Auth/logout', {
    method: 'POST',
    headers: {
      Authorization: token || '',
    },
  });
}
