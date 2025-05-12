import axios from 'axios';

// Create an axios instance with default config
/**
 * Creates a pre-configured axios instance for making API requests
 * 
 * Configuration includes:
 * - baseURL: Uses REACT_APP_API_URL from environment variables if set,
 *            otherwise defaults to local development server (http://localhost:5000/api)
 * - headers: Sets default Content-Type to application/json for all requests
 * - timeout: Sets request timeout to 10 seconds (10000ms)
 */
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10s timeout
});

// Request interceptor for adding auth token
/**
 * Request interceptor that automatically attaches JWT token to requests
 * 
 * This interceptor:
 * 1. Runs before every API request is sent
 * 2. Checks localStorage for an authentication token
 * 3. If token exists, adds it to the Authorization header in Bearer format
 * 4. Passes through any request errors unchanged
 * 
 * This ensures authenticated requests automatically include the token
 * without having to manually add it to each request
 */
api.interceptors.request.use(
    (config) => {
        // Get token from browser's localStorage if it exists
        const token = localStorage.getItem('token');
        
        // If token is present, add it to Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Return modified config with auth header (if token exists)
        return config;
    },
    (error) => {
        // Pass through any request configuration errors
        return Promise.reject(error);
    }
);

// Response interceptor for handling common errors
/**
 * Response interceptor for handling API responses and errors globally.
 * 
 * This interceptor:
 * 1. For successful responses (2xx status codes), simply passes through the response unchanged
 * 2. For error responses:
 *    - Extracts the HTTP status code from the error response
 *    - Handles 401 Unauthorized errors by:
 *      * Removing the invalid/expired token from localStorage
 *      * Redirecting the user to the login page
 *    - For all other errors, rejects the promise with the original error
 * 
 * This provides centralized error handling, especially for authentication failures.
 */
api.interceptors.response.use(
    (response) => {
        // For successful responses, just pass through the response
        return response;
    },
    (error) => {
        // Destructure status from error response, default to undefined if no response
        const { status } = error.response || {};
        
        // Handle 401 Unauthorized responses (token expired/invalid)
        if (status === 401) {
            // Clear the invalid token from storage
            localStorage.removeItem('token');
            // Redirect to login page for re-authentication
            window.location.href = '/login';
        }
        
        // Reject the promise with the original error for further handling
        return Promise.reject(error);
    }
);

export default api;