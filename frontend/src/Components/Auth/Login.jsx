import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ensure the email is normalized (lowercase)
      const normalizedCredentials = {
        ...credentials,
        email: credentials.email.toLowerCase(),
      };

      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizedCredentials),
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Login response data:', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        toast.success('Logged in successfully!');
        navigate('/');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value.toLowerCase() })
          }
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Continue'}
        </button>
      </form>
    </div>
  );
};

export default Login;
