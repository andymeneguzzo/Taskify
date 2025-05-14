import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ThemeToggle from '../components/ThemeToggle';
import CalendarView from '../components/CalendarView';
import './CalendarPage.css';

function CalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again');
      console.error('Error fetching tasks: ', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="calendar-page-container">
      <div className="calendar-page-header">
        <div className="header-left">
          <button className="back-button" onClick={handleBack}>
            &larr; Back
          </button>
          <h2>Task Calendar</h2>
        </div>
        <div className="header-right">
          <ThemeToggle />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading-container">
          <p>Loading calendar...</p>
        </div>
      ) : (
        <div className="calendar-page-content">
          <CalendarView tasks={tasks} />
        </div>
      )}
    </div>
  );
}

export default CalendarPage;
