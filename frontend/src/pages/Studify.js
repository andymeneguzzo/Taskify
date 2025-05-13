import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ThemeToggle from '../components/ThemeToggle';
import NotificationBell from '../components/NotificationBell';
import './Studify.css';

function Studify() {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Comment this out until backend is deployed
    // fetchTopics();
    
    // Use mock data for now
    const mockTopics = [
      {
        _id: '1',
        title: 'JavaScript Fundamentals',
        description: 'Core concepts of JavaScript language',
        subtopics: [
          { _id: '1-1', title: 'Variables and Data Types', completed: true },
          { _id: '1-2', title: 'Functions and Scope', completed: true },
          { _id: '1-3', title: 'Asynchronous Programming', completed: false }
        ]
      },
      {
        _id: '2',
        title: 'React Hooks',
        description: 'Modern React state management',
        subtopics: [
          { _id: '2-1', title: 'useState', completed: true },
          { _id: '2-2', title: 'useEffect', completed: false },
          { _id: '2-3', title: 'useContext', completed: false },
          { _id: '2-4', title: 'useReducer', completed: false }
        ]
      }
    ];
    
    setTopics(mockTopics);
  }, []);

  const fetchTopics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/topics');
      setTopics(response.data);
    } catch (err) {
      console.error('Error fetching topics: ', err);
      // Don't show error to user for now since we know the endpoint doesn't exist yet
      // setError('Failed to fetch topics. Please try again');
      
      // Use mock data instead
      const mockTopics = [
        {
          _id: '1',
          title: 'JavaScript Fundamentals',
          description: 'Core concepts of JavaScript language',
          subtopics: [
            { _id: '1-1', title: 'Variables and Data Types', completed: true },
            { _id: '1-2', title: 'Functions and Scope', completed: true },
            { _id: '1-3', title: 'Asynchronous Programming', completed: false }
          ]
        },
        {
          _id: '2',
          title: 'React Hooks',
          description: 'Modern React state management',
          subtopics: [
            { _id: '2-1', title: 'useState', completed: true },
            { _id: '2-2', title: 'useEffect', completed: false },
            { _id: '2-3', title: 'useContext', completed: false },
            { _id: '2-4', title: 'useReducer', completed: false }
          ]
        }
      ];
      
      setTopics(mockTopics);
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
        <h2>Studify 🎓 - coming soon...</h2>
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
            <p className="modal-info">Topic creation will be available once backend is deployed</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Studify;
