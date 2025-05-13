import React, { useState, useEffect } from 'react';
import './TopicCard.css';
import CircularProgress from './CircularProgress';
import ProgressBar from './ProgressBar';
import Confetti from './Confetti';

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
 * @param {number} completionPercentage - Pre-calculated completion percentage (optional)
 */
function TopicCard({ 
  topic, 
  onToggleSubtopic, 
  onAddSubtopic, 
  onAttachFile, 
  onEdit, 
  onDelete, 
  onUpdate,
  completionPercentage: propCompletionPercentage
}) {
  const { _id, title, description, subtopics = [], attachmentUrl } = topic;
  const [newSubtopicTitle, setNewSubtopicTitle] = useState('');
  const [showAddSubtopic, setShowAddSubtopic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progressView, setProgressView] = useState('horizontal'); // 'horizontal' or 'circular'
  const [showConfetti, setShowConfetti] = useState(false);
  const [previousPercentage, setPreviousPercentage] = useState(0);

  // Calculate completion percentage if not provided as prop
  const completedCount = subtopics.filter(sub => sub.completed).length;
  const totalSubtopics = subtopics.length;
  const calculatedPercentage = totalSubtopics > 0 
    ? Math.round((completedCount / totalSubtopics) * 100) 
    : 0;
    
  // Use the provided percentage if available, otherwise use calculated
  const completionPercentage = propCompletionPercentage !== undefined 
    ? propCompletionPercentage 
    : calculatedPercentage;

  // Check for topic completion to trigger celebration
  useEffect(() => {
    if (completionPercentage === 100 && previousPercentage !== 100 && previousPercentage !== 0) {
      setShowConfetti(true);
      
      // Hide confetti after animation duration
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
    
    setPreviousPercentage(completionPercentage);
  }, [completionPercentage, previousPercentage]);

  // Get progress color based on completion
  const getProgressColor = () => {
    if (completionPercentage === 100) return '#4caf50'; // Green for completed
    if (completionPercentage >= 70) return '#8bc34a'; // Light green for good progress
    if (completionPercentage >= 30) return '#ff9800'; // Orange for some progress
    return '#f44336'; // Red for little progress
  };

  // Toggle between horizontal and circular progress
  const toggleProgressView = () => {
    setProgressView(prev => prev === 'horizontal' ? 'circular' : 'horizontal');
  };

  // Handle subtopic completion toggle
  const handleSubtopicToggle = (subtopicId) => {
    setLoading(true);
    setError('');
    
    onToggleSubtopic(_id, subtopicId)
      .catch(err => setError('Failed to update subtopic'))
      .finally(() => setLoading(false));
  };

  // Handle adding new subtopic
  const handleAddSubtopic = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    onAddSubtopic(_id, newSubtopicTitle)
      .then(() => {
        setNewSubtopicTitle('');
        setShowAddSubtopic(false);
      })
      .catch(err => setError('Failed to add subtopic'))
      .finally(() => setLoading(false));
  };

  // Handle attaching file to main topic
  const handleAttachMainFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is too large (> 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large (max 5MB)');
      return;
    }
    
    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are supported');
      return;
    }
    
    setLoading(true);
    setError('');
    
    onAttachFile(_id, null, file)
      .catch(err => setError('Failed to attach file'))
      .finally(() => setLoading(false));
  };

  // Handle attaching file to a subtopic
  const handleAttachSubtopicFile = (subtopicId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is too large (> 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large (max 5MB)');
      return;
    }
    
    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are supported');
      return;
    }
    
    setLoading(true);
    setError('');
    
    onAttachFile(_id, subtopicId, file)
      .catch(err => setError('Failed to attach file'))
      .finally(() => setLoading(false));
  };

  // Check if a URL is a base64 data string
  const isBase64URL = (url) => {
    return url && url.startsWith('data:');
  };

  return (
    <div className={`topic-card ${completionPercentage === 100 ? 'completed' : ''}`}>
      {/* Show confetti celebration on completion */}
      {showConfetti && <Confetti active={true} />}
      
      <div className="topic-content">
        <div className="topic-header">
          <div className="topic-header-content">
            <div className="topic-title-container">
              <h3 className="topic-title">{title}</h3>
            </div>
            
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
