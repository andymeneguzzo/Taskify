import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import NotificationBell from '../components/NotificationBell';
import TopicCard from '../components/TopicCard';
import TopicForm from '../components/TopicForm';
import { useTopics } from '../context/TopicContext';
import './Studify.css';
import CustomDropdown from '../components/CustomDropdown';

function Studify() {
  // Local UI state
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const navigate = useNavigate();
  
  // Get topics and methods from context
  const { 
    topics, 
    loading, 
    error, 
    sortBy,
    setSorting,
    addTopic, 
    updateTopic, 
    deleteTopic, 
    toggleSubtopic, 
    addSubtopic, 
    attachFile,
    calculateCompletionPercentage 
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
      // Error is already handled in the context
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
        // Error is already handled in the context
      }
    }
  };

  // Handle toggle subtopic completion
  const handleToggleSubtopic = async (topicId, subtopicId) => {
    try {
      await toggleSubtopic(topicId, subtopicId);
    } catch (err) {
      console.error('Error toggling subtopic:', err);
      // Error is already handled in the context
    }
  };

  // Handle add new subtopic
  const handleAddSubtopic = async (topicId, subtopicTitle) => {
    try {
      await addSubtopic(topicId, subtopicTitle);
    } catch (err) {
      console.error('Error adding subtopic:', err);
      // Error is already handled in the context
    }
  };

  // Handle file attachment
  const handleAttachFile = async (topicId, subtopicId, file) => {
    try {
      await attachFile(topicId, subtopicId, file);
    } catch (err) {
      console.error('Error attaching file:', err);
      // Error is already handled in the context
    }
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSorting(e.target.value);
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
          <div className="topics-header-left">
            <h3>My Study Topics</h3>
            <div className="sort-control">
              <label htmlFor="sort-select">Sort by:</label>
              <CustomDropdown
                options={[
                  { value: 'default', label: 'Default' },
                  { value: 'completion-asc', label: 'Progress (Low to High)' },
                  { value: 'completion-desc', label: 'Progress (High to Low)' }
                ]}
                value={sortBy}
                onChange={handleSortChange}
                name="sortBy"
                id="sort-select"
              />
            </div>
          </div>
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
                onToggleSubtopic={handleToggleSubtopic}
                onAddSubtopic={handleAddSubtopic}
                onAttachFile={handleAttachFile}
                onEdit={() => handleEditTopic(topic)}
                onDelete={() => handleDeleteTopic(topic._id)}
                onUpdate={(updatedTopic) => updateTopic(topic._id, updatedTopic)}
                completionPercentage={calculateCompletionPercentage(topic)}
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
