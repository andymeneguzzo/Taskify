import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './NotificationBell.css';

function NotificationBell() {
  const [hasNotifications, setHasNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for notifications when component mounts
    checkNotifications();
    
    // Set up interval to check for notifications periodically
    const interval = setInterval(checkNotifications, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const checkNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      const { reminders, dueToday, overdue } = response.data;
      
      // Set notification state based on if there are any notifications
      setHasNotifications(
        reminders.length > 0 || dueToday.length > 0 || overdue.length > 0
      );
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  const handleBellClick = () => {
    navigate('/notifications');
  };

  return (
    <button 
      className="notification-bell" 
      onClick={handleBellClick}
      aria-label="Notifications"
    >
      {/* Bell icon */}
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
      
      {/* Notification dot */}
      {hasNotifications && <span className="notification-dot"></span>}
    </button>
  );
}

export default NotificationBell;
