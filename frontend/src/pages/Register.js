import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import api from '../api/axios';

function Register() {
    // useState is a React Hook that lets you add state to functional components
    // Each line declares a state variable and its setter function with an initial value
    // Syntax: const [stateVariable, setStateFunction] = useState(initialValue)
    
    // Name state - stores user's name, initialized as empty string
    const [name, setName] = useState('');
    
    // Email state - stores user's email, initialized as empty string 
    const [email, setEmail] = useState('');
    
    // Password state - stores user's password, initialized as empty string
    const [password, setPassword] = useState('');
    
    // Confirm password state - stores password confirmation, initialized as empty string
    const [confirmPassword, setConfirmPassword] = useState('');

    // Error state - stores any registration error messages, initialized as empty string
    const [error, setError] = useState('');
    
    // Loading state - tracks if registration request is in progress, initialized as false
    const [loading, setLoading] = useState(false);
    
    // Navigation hook - provides programmatic navigation to other routes
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        // Prevent default form submission behavior
        e.preventDefault();
        // Clear any previous error messages
        setError('');
    
        // First validation: Check if passwords match
        if (password !== confirmPassword) {
          setError("Passwords don't match");
          return; // Exit early if validation fails
        }
    
        // Set loading state to true to show loading indicator
        setLoading(true);
        
        try {
          // Make API POST request to register endpoint with user data
          const response = await api.post('/users/register', {
            name,     // User's full name
            email,    // User's email address
            password  // User's chosen password
          });
          
          // Check if registration was successful (contains auth token)
          if (response.data.token) {
            // Store JWT token in localStorage for future authenticated requests
            localStorage.setItem('token', response.data.token);
            // Redirect user to dashboard after successful registration
            navigate('/dashboard');
          } else {
            // If no token but request succeeded, redirect to login
            navigate('/login');
          }
        } catch (err) {
          // Handle registration errors:
          // 1. Try to use server-provided error message if available
          // 2. Fall back to generic error message
          setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
          // Always reset loading state when request completes (success or failure)
          setLoading(false);
        }
    };

    return (
        <div className="register-container">
          <h2>Register</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
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
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
    );
}

export default Register;