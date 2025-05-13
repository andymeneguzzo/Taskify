import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ThemeToggle from '../components/ThemeToggle';
import NotificationBell from '../components/NotificationBell';
import './Studify.css';

function Studify() {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/topics');
      setTopics(response.data);
    } catch (err) {
      setError('Failed to fetch topics. Please try again');
      console.error('Error fetching topics: ', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="studify-container">
      <div className="studify-header">
        <h2>Studify 🎓</h2>
        <div className="studify-controls">
          <NotificationBell />
          <ThemeToggle />
          <button className="dashboard-btn" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="topics-section">
        <div className="topics-header">
          <h3>My Study Topics</h3>
          <button 
            className="add-topic-btn" 
            onClick={() => setShowAddTopic(true)}
          >
            + Add New Topic
          </button>
        </div>
        
        {isLoading ? (
          <p className="loading-text">Loading topics...</p>
        ) : topics.length === 0 ? (
          <div className="empty-state">
            <p className="empty-text">No topics yet. Add your first study topic!</p>
          </div>
        ) : (
          <div className="topics-grid">
            {topics.map(topic => (
              <div key={topic._id} className="topic-card">
                <h4>{topic.title}</h4>
                <p>{topic.description}</p>
                
                <div className="topic-progress">
                  <span>Progress:</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${topic.subtopics.filter(st => st.completed).length / (topic.subtopics.length || 1) * 100}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {topic.subtopics.filter(st => st.completed).length}/{topic.subtopics.length}
                  </span>
                </div>
                
                <button className="view-topic-btn">View Details</button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* This will be expanded later to include a modal for adding topics */}
      {showAddTopic && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Topic</h3>
            <button className="modal-close" onClick={() => setShowAddTopic(false)}>×</button>
            {/* Form content will go here */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Studify;
