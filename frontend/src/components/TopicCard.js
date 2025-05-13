import React, { useState } from 'react';
import './TopicCard.css';

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

  // Calculate completion percentage
  const completedCount = subtopics.filter(sub => sub.completed).length;
  const totalSubtopics = subtopics.length;
  const completionPercentage = totalSubtopics > 0 
    ? Math.round((completedCount / totalSubtopics) * 100) 
    : 0;

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
    <div className="topic-card neu-container">
      <div className="topic-card-actions">
        <button className="edit-topic-btn" onClick={onEdit}>Edit</button>
        <button className="delete-topic-btn" onClick={onDelete}>Delete</button>
      </div>
      
      <div className="topic-header">
        <h3 className="topic-title">{title}</h3>
        <div className="topic-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <span className="progress-text">{completionPercentage}%</span>
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
            Add Subtopic
          </button>
        )}
      </div>
    </div>
  );
}

export default TopicCard;
