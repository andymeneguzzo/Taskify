import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import api from '../api/axios';

import './Login.css';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Check if user is already logged in
    useEffect(() => {
      if (localStorage.getItem('token')) {
          navigate('/dashboard');
      }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
          const response = await api.post('/users/login', {
            email,
            password
          });
          
          // Store token in localStorage
          localStorage.setItem('token', response.data.token);
          
          // Redirect to dashboard
          navigate('/dashboard');
        } catch (err) {
          setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
          setLoading(false);
        }
    };

    return (
        <div className="login-container">
          <h2>Login</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
    );
}

export default Login;