import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  // This is a simple check - you would normally verify tokens or use a proper auth state
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
