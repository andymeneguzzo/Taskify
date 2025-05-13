import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import NotificationBell from '../components/NotificationBell';
import TopicCard from '../components/TopicCard';
import TopicForm from '../components/TopicForm';
import { useTopics } from '../context/TopicContext';
import './Studify.css';

function Studify() {
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const navigate = useNavigate();
  
  // Get topics and methods from context
  const { 
    topics, 
    loading, 
    error, 
    addTopic, 
    updateTopic, 
    deleteTopic, 
    toggleSubtopic, 
    addSubtopic, 
    attachFile 
  } = useTopics();

  // Handle form submission (for both create and edit)
  const handleSubmitTopic = async (topicData) => {
    try {
      if (editingTopic) {
        await updateTopic(editingTopic._id, topicData);
        setEditingTopic(null);
      } else {
        await addTopic(topicData);
        setShowAddTopic(false);
      }
    } catch (err) {
      console.error('Error submitting topic:', err);
    }
  };

  // Handle cancel form
  const handleCancelForm = () => {
    setShowAddTopic(false);
    setEditingTopic(null);
  };

  // Handle edit topic
  const handleEditTopic = (topic) => {
    setEditingTopic(topic);
  };

  // Handle delete topic
  const handleDeleteTopic = async (topicId) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      try {
        await deleteTopic(topicId);
      } catch (err) {
        console.error('Error deleting topic:', err);
      }
    }
  };

  // Handle logout
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
        
        {loading ? (
          <p className="loading-text">Loading topics...</p>
        ) : topics.length === 0 ? (
          <div className="empty-state">
            <p className="empty-text">No topics yet. Add your first study topic!</p>
          </div>
        ) : (
          <div className="topics-grid">
            {topics.map(topic => (
              <TopicCard
                key={topic._id}
                topic={topic}
                onToggleSubtopic={toggleSubtopic}
                onAddSubtopic={addSubtopic}
                onAttachFile={attachFile}
                onEdit={() => handleEditTopic(topic)}
                onDelete={() => handleDeleteTopic(topic._id)}
                onUpdate={updateTopic}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Modal for adding or editing a topic */}
      {(showAddTopic || editingTopic) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={handleCancelForm}>×</button>
            <TopicForm
              topic={editingTopic}
              onSubmit={handleSubmitTopic}
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Studify;
