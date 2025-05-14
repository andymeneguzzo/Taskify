import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Studify from './pages/Studify';
import CalendarPage from './pages/CalendarPage';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { TopicProvider } from './context/TopicContext';
import NotificationsPage from './pages/NotificationsPage';
import { ToastProvider } from './context/ToastContext';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Notifications route */}
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Calendar route */}
              <Route 
                path="/calendar" 
                element={
                  <ProtectedRoute>
                    <CalendarPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Studify route */}
              <Route 
                path="/studify" 
                element={
                  <ProtectedRoute>
                    <TopicProvider>
                      <Studify />
                    </TopicProvider>
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all - redirect to landing page if not authenticated, dashboard if authenticated */}
              <Route 
                path="*" 
                element={
                  localStorage.getItem('token') 
                    ? <Navigate to="/dashboard" replace />
                    : <Navigate to="/" replace />
                } 
              />
            </Routes>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
