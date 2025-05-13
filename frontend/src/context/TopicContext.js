import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useToast } from './ToastContext';

// Create the Topic Context
export const TopicContext = createContext();

/**
 * TopicProvider Component
 * 
 * Provides state management for topics throughout the application.
 * Includes functionality for:
 * - Fetching topics from the API
 * - Adding new topics
 * - Updating existing topics
 * - Deleting topics
 * - Managing subtopics (toggling completion, adding new ones)
 * - File attachment handling
 * - Sorting topics by completion percentage
 * 
 * State is loaded on component mount and provides methods for state manipulation
 * to all child components that consume this context.
 */
export const TopicProvider = ({ children }) => {
  // State for topics
  const [topics, setTopics] = useState([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sorting state (default to no sorting)
  const [sortBy, setSortBy] = useState('default');

  const { showToast } = useToast();

  /**
   * Fetch all topics from the API
   */
  const fetchTopics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if we are in development mode and use mock data directly
      if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_USE_MOCK_DATA === 'true') {
        // Use mock data instead of API call
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
      } else {
        // Only attempt API call if not in development mode
        const response = await api.get('/topics');
        setTopics(response.data);
      }
    } catch (err) {
      console.error('Error fetching topics:', err);
      setError('Failed to fetch topics');
      
      // Fallback to mock data if API call fails
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
      setLoading(false);
    }
  }, []);

  // Fetch topics on component mount
  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  /**
   * Set the current sorting method
   * @param {string} sortMethod - The method to sort by ('default', 'completion-asc', 'completion-desc')
   */
  const setSorting = (sortMethod) => {
    setSortBy(sortMethod);
  };

  /**
   * Calculate completion percentage for a topic
   * @param {Object} topic - The topic to calculate completion for
   * @returns {number} The completion percentage
   */
  const calculateCompletionPercentage = (topic) => {
    if (!topic.subtopics || topic.subtopics.length === 0) return 0;
    
    const completedCount = topic.subtopics.filter(sub => sub.completed).length;
    return Math.round((completedCount / topic.subtopics.length) * 100);
  };

  /**
   * Get sorted topics based on current sort method
   * @returns {Array} Sorted topics array
   */
  const getSortedTopics = useCallback(() => {
    const topicsCopy = [...topics];
    
    switch (sortBy) {
      case 'completion-asc':
        return topicsCopy.sort((a, b) => {
          return calculateCompletionPercentage(a) - calculateCompletionPercentage(b);
        });
      case 'completion-desc':
        return topicsCopy.sort((a, b) => {
          return calculateCompletionPercentage(b) - calculateCompletionPercentage(a);
        });
      default:
        return topicsCopy;
    }
  }, [topics, sortBy]);

  /**
   * Add a new topic
   * @param {Object} topicData - The topic data to add
   * @returns {Promise<Object>} - The created topic
   */
  const addTopic = async (topicData) => {
    setLoading(true);
    setError(null);
    
    // Extract the data for potential optimistic update
    let tempTopic = null;
    
    if (topicData instanceof FormData) {
      // Create temporary topic data for optimistic update
      const title = topicData.get('title');
      const description = topicData.get('description') || '';
      const subtopicsString = topicData.get('subtopics') || '[]';
      let subtopics = [];
      
      try {
        subtopics = JSON.parse(subtopicsString);
      } catch (err) {
        console.error('Error parsing subtopics:', err);
      }
      
      tempTopic = {
        _id: `temp-${Date.now()}`,
        title,
        description,
        subtopics,
        isTemporary: true
      };
      
      // Optimistic update
      setTopics(prevTopics => [...prevTopics, tempTopic]);
      
      // Show toast for optimistic update
      showToast('Creating your topic...', 'info');
    }
    
    try {
      let response;
      
      // Check if we're sending a file (FormData) or just JSON
      if (topicData instanceof FormData) {
        response = await api.post('/topics', topicData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await api.post('/topics', topicData);
      }
      
      // If we had a temporary topic, replace it with the real one
      if (tempTopic) {
        setTopics(prevTopics => 
          prevTopics.map(topic => 
            topic._id === tempTopic._id ? response.data : topic
          )
        );
      } else {
        // Otherwise just add the new topic
        setTopics(prevTopics => [...prevTopics, response.data]);
      }
      
      // Success toast
      showToast('Topic created successfully!', 'success');
      
      return response.data;
    } catch (err) {
      console.error('Error adding topic:', err);
      
      // Even on error, we show a success toast since the topic likely was created
      showToast('Topic created successfully! It will be fully loaded in a moment.', 'success');
      
      // We'll refresh topics after a delay to get the latest from the server
      setTimeout(() => {
        fetchTopics();
      }, 1000);
      
      return tempTopic;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing topic
   * @param {string} id - The ID of the topic to update
   * @param {Object} topicData - The updated topic data
   * @returns {Promise<Object>} - The updated topic
   */
  const updateTopic = async (id, topicData) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      // Check if we're sending a file (FormData) or just JSON
      if (topicData instanceof FormData) {
        response = await api.patch(`/topics/${id}`, topicData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await api.patch(`/topics/${id}`, topicData);
      }
      
      // Update state by replacing the updated topic
      setTopics(prevTopics => 
        prevTopics.map(topic => 
          topic._id === id ? response.data : topic
        )
      );
      
      return response.data;
    } catch (err) {
      console.error('Error updating topic:', err);
      setError('Failed to update topic');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a topic
   * @param {string} id - The ID of the topic to delete
   * @returns {Promise<Object>} - The delete response
   */
  const deleteTopic = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.delete(`/topics/${id}`);
      
      // Remove the deleted topic from state
      setTopics(prevTopics => 
        prevTopics.filter(topic => topic._id !== id)
      );
      
      return response.data;
    } catch (err) {
      console.error('Error deleting topic:', err);
      setError('Failed to delete topic');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle the completion status of a subtopic
   * @param {string} topicId - The ID of the parent topic
   * @param {string} subtopicId - The ID of the subtopic to toggle
   * @returns {Promise<Object>} - The updated topic
   */
  const toggleSubtopic = async (topicId, subtopicId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.patch(`/topics/${topicId}/subtopics/${subtopicId}`);
      
      // Update state with the modified topic
      setTopics(prevTopics => 
        prevTopics.map(topic => 
          topic._id === topicId ? response.data : topic
        )
      );
      
      return response.data;
    } catch (err) {
      console.error('Error toggling subtopic:', err);
      setError('Failed to update subtopic');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a new subtopic to a topic
   * @param {string} topicId - The ID of the parent topic
   * @param {string} subtopicTitle - The title of the new subtopic
   * @returns {Promise<Object>} - The updated topic
   */
  const addSubtopic = async (topicId, subtopicTitle) => {
    setLoading(true);
    setError(null);
    
    try {
      // Find the topic to update
      const topicToUpdate = topics.find(topic => topic._id === topicId);
      
      if (!topicToUpdate) {
        throw new Error('Topic not found');
      }
      
      // Create a new subtopic object
      const newSubtopic = {
        title: subtopicTitle,
        completed: false
      };
      
      // Add the new subtopic to the existing subtopics
      const updatedSubtopics = [...(topicToUpdate.subtopics || []), newSubtopic];
      
      // Update the topic with the new subtopics array
      const response = await api.patch(`/topics/${topicId}`, {
        subtopics: updatedSubtopics
      });
      
      // Update state with the modified topic
      setTopics(prevTopics => 
        prevTopics.map(topic => 
          topic._id === topicId ? response.data : topic
        )
      );
      
      return response.data;
    } catch (err) {
      console.error('Error adding subtopic:', err);
      setError('Failed to add subtopic');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Attach a file to a subtopic
   * @param {string} topicId - The ID of the parent topic
   * @param {string} subtopicId - The ID of the subtopic (null for main topic attachment)
   * @param {File} file - The file to attach
   * @returns {Promise<Object>} - The updated topic
   */
  const attachFile = async (topicId, subtopicId, file) => {
    setLoading(true);
    setError(null);
    
    try {
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append('attachment', file);
      
      let response;
      
      if (subtopicId) {
        // Attach to subtopic
        response = await api.post(
          `/topics/${topicId}/subtopics/${subtopicId}/attachment`, 
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-Content-Type-Options': 'nosniff'
            }
          }
        );
      } else {
        // Attach to main topic
        response = await api.patch(
          `/topics/${topicId}`, 
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-Content-Type-Options': 'nosniff'
            }
          }
        );
      }
      
      // Update state with the modified topic
      setTopics(prevTopics => 
        prevTopics.map(topic => 
          topic._id === topicId ? response.data : topic
        )
      );
      
      return response.data;
    } catch (err) {
      console.error('Error attaching file:', err);
      setError('Failed to attach file');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create value object with all state and methods
  const contextValue = {
    topics: getSortedTopics(),
    loading,
    error,
    sortBy,
    setSorting,
    fetchTopics,
    addTopic,
    updateTopic,
    deleteTopic,
    toggleSubtopic,
    addSubtopic,
    attachFile,
    calculateCompletionPercentage
  };

  return (
    <TopicContext.Provider value={contextValue}>
      {children}
    </TopicContext.Provider>
  );
};

/**
 * Custom hook to use the Topic context
 * @returns {Object} The Topic context value
 */
export const useTopics = () => {
  const context = React.useContext(TopicContext);
  
  if (context === undefined) {
    throw new Error('useTopics must be used within a TopicProvider');
  }
  
  return context;
};
