import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../api/axios';
import './NotificationsPage.css';

function NotificationsPage() {
    const [notifications, setNotifications] = useState({
        reminders: [],
        dueToday: [],
        overdue: []
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/notifications');
            setNotifications(response.data);
        } catch (err) {
        setError('Failed to fetch notifications');
        console.error('Error fetching notifications:', err);
        } finally {
        setIsLoading(false);
        }
    };

    const handleMarkAsRead = async () => {
        try {
          await api.put('/notifications/mark-read');
          // No need to update UI since we're already showing the notifications
        } catch (err) {
          console.error('Error marking notifications as read:', err);
        }
    };

    useEffect(() => {
        // Mark notifications as read when the component mounts
        handleMarkAsRead();
    }, []);

    const handleTaskClick = (taskId) => {
        navigate(`/dashboard?taskId=${taskId}`);
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return null;
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return null;
            
            const now = new Date();
            const isToday = date.toDateString() === now.toDateString();
            
            const options = { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
        
        return isToday 
            ? `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
            : date.toLocaleDateString(undefined, options);
        } catch (error) {
            console.error('Error formatting date:', error);
            return null;
        }
    };

    const hasAnyNotifications = 
        notifications.reminders.length > 0 || 
        notifications.dueToday.length > 0 || 
        notifications.overdue.length > 0;

        /**
         * Renders the Notifications Page UI with three sections:
         * 1. Reminders - Tasks with upcoming reminders (next 24 hours)
         * 2. Due Today - Tasks due today
         * 3. Overdue - Tasks past their due date
         * 
         * The component handles three states:
         * - Loading state (shows loading message)
         * - Empty state (no notifications)
         * - Data state (shows categorized notifications)
         * 
         * Each notification card is clickable and navigates to the task in dashboard
         * 
         * The UI includes:
         * - Header with back button to dashboard
         * - Error message display (if any)
         * - Three distinct sections with appropriate icons
         * - Task details including title, description, category and formatted dates
         */
        return (
            <div className="notifications-container">
              <div className="notifications-header">
                <h2>Notifications</h2>
                <button className="back-btn" onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
                </button>
              </div>
        
              {error && <div className="error-message">{error}</div>}
              
              {isLoading ? (
                <p className="loading-text">Loading notifications...</p>
              ) : !hasAnyNotifications ? (
                <div className="empty-notifications">
                  <p>You're all caught up! 🎉</p>
                  <p>No upcoming reminders or due tasks.</p>
                </div>
              ) : (
                <div className="notifications-sections">
                  {/* Reminders Section */}
                  {notifications.reminders.length > 0 && (
                    <div className="notification-section">
                      <h3>
                        <span className="notification-icon">🔔</span> 
                        Upcoming Reminders
                      </h3>
                      <div className="notification-cards">
                        {notifications.reminders.map(task => (
                          <div 
                            key={`reminder-${task._id}`}
                            className="notification-card reminder-card"
                            onClick={() => handleTaskClick(task._id)}
                          >
                            <h4>{task.title}</h4>
                            {task.description && (
                              <p className="notification-description">{task.description}</p>
                            )}
                            <div className="notification-meta">
                              <span className="notification-category">{task.category}</span>
                              <span className="notification-time">
                                Reminder: {formatDate(task.reminderDate)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Due Today Section */}
                  {notifications.dueToday.length > 0 && (
                    <div className="notification-section">
                      <h3>
                        <span className="notification-icon">📅</span>
                        Due Today
                      </h3>
                      <div className="notification-cards">
                        {notifications.dueToday.map(task => (
                          <div 
                            key={`due-${task._id}`}
                            className="notification-card due-today-card"
                            onClick={() => handleTaskClick(task._id)}
                          >
                            <h4>{task.title}</h4>
                            {task.description && (
                              <p className="notification-description">{task.description}</p>
                            )}
                            <div className="notification-meta">
                              <span className="notification-category">{task.category}</span>
                              <span className="notification-time">
                                Due: {formatDate(task.dueDate)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Overdue Section */}
                  {notifications.overdue.length > 0 && (
                    <div className="notification-section">
                      <h3>
                        <span className="notification-icon">❗</span>
                        Overdue Tasks
                      </h3>
                      <div className="notification-cards">
                        {notifications.overdue.map(task => (
                          <div 
                            key={`overdue-${task._id}`}
                            className="notification-card overdue-card"
                            onClick={() => handleTaskClick(task._id)}
                          >
                            <h4>{task.title}</h4>
                            {task.description && (
                              <p className="notification-description">{task.description}</p>
                            )}
                            <div className="notification-meta">
                              <span className="notification-category">{task.category}</span>
                              <span className="notification-time">
                                Due: {formatDate(task.dueDate)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
        );
}