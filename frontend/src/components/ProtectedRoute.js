import {Navigate} from 'react-router-dom';

/**
 * ProtectedRoute - A higher-order component that guards access to protected routes
 * 
 * This component:
 * 1. Checks for an authentication token in localStorage
 * 2. If no token exists (user not authenticated):
 *    - Redirects to the login page using React Router's Navigate component
 *    - Uses 'replace' prop to prevent going back to protected route via browser history
 * 3. If authenticated:
 *    - Renders the child components passed to it (the protected content)
 * 
 * Usage:
 * <ProtectedRoute>
 *   <YourProtectedComponent />
 * </ProtectedRoute>
 * 
 * Note: The token check is basic - in a production app you might want to:
 * - Verify token validity with the server
 * - Handle token expiration
 * - Implement more robust authentication checks
 */
function ProtectedRoute({ children }) {
    // Check if the user is authenticated by looking for a token in localStorage
    const isAuthenticated = () => {
      const token = localStorage.getItem('token');
      return !!token; // Convert to boolean (true if token exists, false otherwise)
    };
  
    // If not authenticated, redirect to login page
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
  
    // If authenticated, render the protected child components
    return children;
}

export default ProtectedRoute;