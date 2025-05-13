import React, { useState, useEffect } from 'react';
import './TopicCard.css';
import CircularProgress from './CircularProgress';
import ProgressBar from './ProgressBar';

/**
 * TopicCard Component
 * 
 * Displays a topic with title, description, main attachment, and subtopics list
 * Allows for subtopic management and file attachments
 * 
 * @param {Object} topic - The topic object containing title, description, etc.
 * @param {Function} onToggleSubtopic - Function to toggle subtopic completion
 * @param {Function} onAddSubtopic - Function to add a new subtopic
 * @param {Function} onAttachFile - Function to attach file to topic or subtopic
 * @param {Function} onEdit - Function to edit the topic
 * @param {Function} onDelete - Function to delete the topic
 * @param {Function} onUpdate - Function to update the topic (used for direct updates)
 */
function TopicCard({ 
  topic, 
  onToggleSubtopic, 
  onAddSubtopic, 
  onAttachFile, 
  onEdit, 
  onDelete, 
  onUpdate 
}) {
  const { _id, title, description, subtopics = [], attachmentUrl } = topic;
  const [newSubtopicTitle, setNewSubtopicTitle] = useState('');
  const [showAddSubtopic, setShowAddSubtopic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progressView, setProgressView] = useState('horizontal'); // 'horizontal' or 'circular'

  // Calculate completion percentage
  const completedCount = subtopics.filter(sub => sub.completed).length;
  const totalSubtopics = subtopics.length;
  const completionPercentage = totalSubtopics > 0 
    ? Math.round((completedCount / totalSubtopics) * 100) 
    : 0;

  // Get progress color based on completion
  const getProgressColor = () => {
    if (completionPercentage === 100) return '#4caf50'; // Green for completed
    if (completionPercentage >= 70) return '#8bc34a'; // Light green for good progress
    if (completionPercentage >= 30) return '#ff9800'; // Orange for some progress
    return '#f44336'; // Red for little progress
  };

  // Toggle progress view
  const toggleProgressView = () => {
    setProgressView(prev => prev === 'horizontal' ? 'circular' : 'horizontal');
  };

  // Handle checkbox toggle for subtopics
  const handleSubtopicToggle = (subtopicId) => {
    if (onToggleSubtopic) {
      onToggleSubtopic(_id, subtopicId);
    }
  };

  // Handle adding a new subtopic
  const handleAddSubtopic = (e) => {
    e.preventDefault();
    if (newSubtopicTitle.trim() && onAddSubtopic) {
      onAddSubtopic(_id, newSubtopicTitle.trim());
      setNewSubtopicTitle('');
      setShowAddSubtopic(false);
    }
  };

  // Handle file attachment for main topic
  const handleAttachMainFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      if (onAttachFile) {
        onAttachFile(_id, null, file);
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  // Handle file attachment for subtopic
  const handleAttachSubtopicFile = (subtopicId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      if (onAttachFile) {
        onAttachFile(_id, subtopicId, file);
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  // Determine if URL is a base64 data URL or external URL
  const isBase64URL = (url) => {
    return url && url.startsWith('data:');
  };

  return (
    <div className={`topic-card ${completionPercentage === 100 ? 'completed' : ''}`}>
      <div className="topic-content">
        <div className="topic-header">
          <div className="topic-header-content">
            <h3 className="topic-title">{title}</h3>
            
            <div className="topic-card-actions">
              <button className="edit-topic-btn" onClick={onEdit}>Edit</button>
              <button className="delete-topic-btn" onClick={onDelete}>Delete</button>
              <button 
                className="toggle-progress-btn" 
                onClick={toggleProgressView}
                aria-label={`Switch to ${progressView === 'horizontal' ? 'circular' : 'horizontal'} progress view`}
              >
                {/* Icon for toggle - alternates between horizontal and circular icons */}
                {progressView === 'horizontal' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className="topic-progress-wrapper">
            {progressView === 'horizontal' ? (
              <div className="topic-progress-container">
                <ProgressBar 
                  percentage={completionPercentage} 
                  size="medium"
                  barColor={getProgressColor()}
                  animated={true}
                  showPercentage={true}
                  className="topic-progress-enhanced"
                />
              </div>
            ) : (
              <div className="topic-circular-progress">
                <CircularProgress 
                  percentage={completionPercentage} 
                  size="medium"
                  strokeColor={getProgressColor()}
                  backgroundColor="var(--bg-secondary)"
                  showText={true}
                  animated={true}
                />
              </div>
            )}
          </div>
        </div>

        {description && <p className="topic-description">{description}</p>}

        {/* Error message */}
        {error && <div className="upload-error">{error}</div>}

        {/* Main attachment section */}
        <div className="topic-attachment">
          {attachmentUrl ? (
            <div className="attachment-preview">
              <a 
                href={attachmentUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="attachment-link"
              >
                {isBase64URL(attachmentUrl) ? 'View PDF Attachment' : 'View Attachment'}
              </a>
            </div>
          ) : (
            <div className="attachment-upload">
              <label className="upload-label">
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={handleAttachMainFile} 
                  disabled={loading}
                  style={{ display: 'none' }}
                />
                <span className="attach-btn">
                  {loading ? 'Uploading...' : 'Attach File'}
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Subtopics section */}
        <div className="subtopics-section">
          <h4 className="subtopics-header">Subtopics</h4>
          
          {subtopics.length > 0 ? (
            <ul className="subtopics-list">
              {subtopics.map(subtopic => (
                <li key={subtopic._id} className={`subtopic-item ${subtopic.completed ? 'completed' : ''}`}>
                  <div className="subtopic-content">
                    <label className="subtopic-label">
                      <input 
                        type="checkbox" 
                        checked={subtopic.completed || false}
                        onChange={() => handleSubtopicToggle(subtopic._id)}
                        disabled={loading}
                      />
                      <span className="subtopic-title">{subtopic.title}</span>
                    </label>
                  </div>
                  
                  <div className="subtopic-actions">
                    {subtopic.attachmentUrl ? (
                      <a 
                        href={subtopic.attachmentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="attachment-link small"
                      >
                        View
                      </a>
                    ) : (
                      <label className="upload-label small">
                        <input 
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => handleAttachSubtopicFile(subtopic._id, e)} 
                          disabled={loading}
                          style={{ display: 'none' }}
                        />
                        <span className="attach-btn small">
                          {loading ? '...' : 'Attach'}
                        </span>
                      </label>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-subtopics">No subtopics yet</p>
          )}

          {/* Add subtopic form */}
          {showAddSubtopic ? (
            <form onSubmit={handleAddSubtopic} className="add-subtopic-form">
              <input
                type="text"
                value={newSubtopicTitle}
                onChange={(e) => setNewSubtopicTitle(e.target.value)}
                placeholder="Subtopic title"
                disabled={loading}
                autoFocus
              />
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="add-btn"
                  disabled={loading || !newSubtopicTitle.trim()}
                >
                  Add
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowAddSubtopic(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button 
              className="add-subtopic-btn"
              onClick={() => setShowAddSubtopic(true)}
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Subtopic
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopicCard;
