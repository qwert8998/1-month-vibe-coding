import React, { useState } from 'react';
import { login } from './api';
import '../../App.css';

const AUTH_TOKEN_KEY = 'authToken';
const AUTH_TOKEN_EXPIRES_AT_KEY = 'authTokenExpiresAt';
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

interface LoginResponse {
  status: string;
  token: string;
}

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data: LoginResponse = await login(username, password);
      if (data.status === 'success' && data.token) {
        const expiresAt = Date.now() + ONE_DAY_IN_MS;
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        localStorage.setItem(AUTH_TOKEN_EXPIRES_AT_KEY, String(expiresAt));
        window.location.href = '/customer'; // Redirect to first feature
      } else {
        throw new Error('Login failed');
      }
    } catch {
      setError('Login failed, please try again');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="form-container">
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
