import React, { useState, useEffect } from 'react';
import './TopicForm.css';
import api from '../api/axios';

/**
 * TopicForm Component
 * 
 * A form for creating or updating topics with title, description,
 * main attachment, and dynamic subtopic fields.
 * 
 * @param {Object} topic - Existing topic for editing (null for new topics)
 * @param {Function} onSubmit - Callback for when form is submitted successfully
 * @param {Function} onCancel - Callback for when form is cancelled
 */
function TopicForm({ topic, onSubmit, onCancel }) {
  // Initial form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subtopics: [],
  });

  // State for file uploads
  const [mainAttachment, setMainAttachment] = useState(null);
  const [mainAttachmentName, setMainAttachmentName] = useState('');
  
  // UI states
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newSubtopic, setNewSubtopic] = useState('');

  // Add state for drag operation
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Initialize form with existing topic data if provided
  useEffect(() => {
    if (topic) {
      setFormData({
        title: topic.title || '',
        description: topic.description || '',
        subtopics: topic.subtopics || [],
      });
      
      // Set attachment name if it exists
      if (topic.attachmentUrl) {
        // Extract filename from URL or set generic name for base64
        if (topic.attachmentUrl.startsWith('data:')) {
          setMainAttachmentName('Current PDF Attachment');
        } else {
          const filename = topic.attachmentUrl.split('/').pop();
          setMainAttachmentName(filename);
        }
      }
      
      setIsEditing(true);
    }
  }, [topic]);

  /**
   * Handle changes to text inputs
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field if present
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  /**
   * Handle main file attachment
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (PDF only)
      if (file.type !== 'application/pdf') {
        setErrors({
          ...errors,
          file: 'Only PDF files are accepted',
        });
        return;
      }
      
      setMainAttachment(file);
      setMainAttachmentName(file.name);
      
      // Clear any file errors
      if (errors.file) {
        setErrors({
          ...errors,
          file: '',
        });
      }
    }
  };

  /**
   * Add a new subtopic to the list
   */
  const addSubtopic = () => {
    if (newSubtopic.trim()) {
      setFormData({
        ...formData,
        subtopics: [
          ...formData.subtopics,
          {
            title: newSubtopic.trim(),
            completed: false,
          },
        ],
      });
      setNewSubtopic('');
    }
  };

  /**
   * Remove a subtopic from the list
   */
  const removeSubtopic = (index) => {
    const updatedSubtopics = [...formData.subtopics];
    updatedSubtopics.splice(index, 1);
    setFormData({
      ...formData,
      subtopics: updatedSubtopics,
    });
  };

  /**
   * Handle drag start
   */
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Set some data (required for Firefox)
    e.dataTransfer.setData('text/plain', index);
    // Add a class to the dragged item
    e.target.classList.add('dragging');
  };

  /**
   * Handle drag over
   */
  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
  };

  /**
   * Handle drop
   */
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    // If the item is dropped in the same position, do nothing
    if (draggedIndex === dropIndex) {
      return;
    }
    
    // Create a copy of the subtopics array
    const newSubtopics = [...formData.subtopics];
    
    // Remove the dragged item from its original position
    const draggedItem = newSubtopics[draggedIndex];
    newSubtopics.splice(draggedIndex, 1);
    
    // Insert the dragged item at its new position
    newSubtopics.splice(dropIndex, 0, draggedItem);
    
    // Update the state with the new order
    setFormData({
      ...formData,
      subtopics: newSubtopics,
    });
    
    // Reset the dragged index
    setDraggedIndex(null);
    
    return false;
  };

  /**
   * Handle drag end
   */
  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggedIndex(null);
  };

  /**
   * Validate form fields
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      
      // Add text fields to FormData
      formDataToSend.append('title', formData.title);
      if (formData.description) {
        formDataToSend.append('description', formData.description);
      }
      
      // Add subtopics as JSON string
      formDataToSend.append('subtopics', JSON.stringify(formData.subtopics));
      
      // Add file if present
      if (mainAttachment) {
        formDataToSend.append('attachment', mainAttachment);
      }
      
      let response;
      
      // Use the appropriate HTTP method based on whether we're creating or updating
      if (isEditing && topic?._id) {
        response = await api.patch(`/topics/${topic._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await api.post('/topics', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      // Call the onSubmit callback with the response data
      if (onSubmit) {
        onSubmit(response.data);
      }
      
      // Reset form if creating a new topic
      if (!isEditing) {
        setFormData({
          title: '',
          description: '',
          subtopics: [],
        });
        setMainAttachment(null);
        setMainAttachmentName('');
        setNewSubtopic('');
      }
      
    } catch (error) {
      console.error('Error submitting topic:', error);
      setErrors({
        ...errors,
        form: error.response?.data?.message || 'An error occurred while saving the topic.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="topic-form-container neu-container">
      <h3>{isEditing ? 'Edit Topic' : 'Create New Topic'}</h3>
      
      {errors.form && <div className="error-message form-error">{errors.form}</div>}
      
      <form onSubmit={handleSubmit} className="topic-form">
        {/* Title field */}
        <div className="form-group">
          <label htmlFor="title">Topic Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter topic title"
            disabled={loading}
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>
        
        {/* Description field */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter topic description (optional)"
            rows="5"
            disabled={loading}
          />
        </div>
        
        {/* Main attachment field */}
        <div className="form-group">
          <label>Main PDF Attachment</label>
          <div className="file-upload-container">
            <input
              type="file"
              id="main-attachment"
              accept="application/pdf"
              onChange={handleFileChange}
              disabled={loading}
              className={errors.file ? 'error' : ''}
            />
            <label htmlFor="main-attachment" className="file-upload-label">
              {mainAttachmentName ? mainAttachmentName : 'Choose PDF file'}
            </label>
            {errors.file && <span className="error-message">{errors.file}</span>}
          </div>
          
          {/* Show existing attachment if available */}
          {isEditing && topic?.attachmentUrl && !mainAttachment && (
            <div className="current-attachment">
              <a 
                href={topic.attachmentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="view-attachment-link"
              >
                View Current Attachment
              </a>
            </div>
          )}
        </div>
        
        {/* Subtopics section with native drag and drop */}
        <div className="form-group">
          <label>Subtopics</label>
          
          {/* List of current subtopics with native drag and drop */}
          {formData.subtopics.length > 0 && (
            <ul className="subtopics-list">
              {formData.subtopics.map((subtopic, index) => (
                <li 
                  key={subtopic._id || `item-${index}`}
                  className="subtopic-item"
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="subtopic-drag-handle">
                    <span className="drag-icon">≡</span>
                  </div>
                  <span className="subtopic-title">{subtopic.title}</span>
                  <button
                    type="button"
                    className="remove-subtopic-btn"
                    onClick={() => removeSubtopic(index)}
                    disabled={loading}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          
          {/* Add new subtopic - updated for better styling */}
          <div className="add-subtopic-container">
            <input
              type="text"
              value={newSubtopic}
              onChange={(e) => setNewSubtopic(e.target.value)}
              placeholder="Enter new subtopic title"
              disabled={loading}
            />
            <button
              type="button"
              className="add-subtopic-btn"
              onClick={addSubtopic}
              disabled={!newSubtopic.trim() || loading}
            >
              Add Subtopic
            </button>
          </div>
        </div>
        
        {/* Form actions */}
        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditing ? 'Update Topic' : 'Create Topic'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              className="cancel-btn"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TopicForm;
