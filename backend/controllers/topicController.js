const Topic = require('../models/Topic');
const fs = require('fs');
const path = require('path');
// Import only if using Cloudinary
// const { cloudinary } = require('../config/cloudinary');

// Function to convert file to base64
const fileToBase64 = (filePath) => {
  const fileData = fs.readFileSync(filePath);
  return `data:application/pdf;base64,${fileData.toString('base64')}`;
};

// @desc Create a new topic
// @route POST /api/topics
// @access Private
/**
 * Creates a new topic in the database
 * 
 * This controller handles POST requests to create new topics. It:
 * 1. Validates required fields (title is mandatory)
 * 2. Constructs the topic data object with user ID from auth
 * 3. Creates the topic in MongoDB
 * 4. Returns the created topic or appropriate error responses
 * 
 * Request body should contain:
 * - title: String (required)
 * - description: String (optional)
 * - subtopics: Array of subtopic objects (optional)
 * - attachmentUrl: String URL for attachments (optional)
 * 
 * On success: Returns 201 with created topic
 * On error: Returns 400 for validation errors or 500 for server errors
 */
const createTopic = async (req, res) => {
  try {
    console.log('Received topic data:', req.body);
    
    const { title, description } = req.body;
    // Parse subtopics if they're sent as JSON string
    const subtopics = req.body.subtopics ? JSON.parse(req.body.subtopics) : [];

    if (!title) {
      return res.status(400).json({ message: 'Please add a title' });
    }

    let attachmentUrl = '';
    
    // Handle file upload if present
    if (req.file) {
      // Option 1: Base64 encoding
      attachmentUrl = fileToBase64(req.file.path);
      
      // Clean up file after encoding
      fs.unlinkSync(req.file.path);
      
      // Option 2: If using Cloudinary (comment out Option 1 and uncomment this)
      // attachmentUrl = req.file.path; // Cloudinary URL
    }

    const topicData = {
      title,
      description,
      user: req.user._id,
      subtopics: subtopics || [],
      attachmentUrl
    };
    
    console.log('Creating topic with data:', topicData);
    
    const topic = await Topic.create(topicData);
    res.status(201).json(topic);
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Get user topics
// @route GET /api/topics
// @access Private
/**
 * Retrieves all topics belonging to the authenticated user
 * 
 * This controller handles GET requests to fetch topics. It:
 * 1. Queries the database for topics where user matches the authenticated user's ID
 * 2. Uses .lean() for better performance (returns plain JS objects)
 * 3. Returns the topics array or appropriate error responses
 * 
 * On success: Returns 200 with array of topic objects
 * On error: Returns 500 for server errors
 */
const getUserTopics = async (req, res) => {
  try {
    const topics = await Topic.find({ user: req.user._id }).lean();
    res.status(200).json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Update topic
// @route PUT /api/topics/:id
// @access Private
/**
 * Updates an existing topic in the database
 * 
 * This controller handles PUT requests to update topics. It:
 * 1. Finds the topic by ID from request parameters
 * 2. Validates the topic exists (404 if not found)
 * 3. Verifies the requesting user owns the topic (401 if unauthorized)
 * 4. Updates the topic with the request body data
 * 5. Returns the updated topic or appropriate error responses
 * 
 * Request parameters:
 * - id: Topic ID to update (required)
 * 
 * Request body can contain any valid topic fields to update:
 * - title: String
 * - description: String
 * - subtopics: Array
 * - attachmentUrl: String
 * 
 * On success: Returns 200 with updated topic
 * On error: Returns 404 (not found), 401 (unauthorized), or 500 (server error)
 */
const updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Check if the topic belongs to the user
    if (topic.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Handle file upload if present
    if (req.file) {
      // Option 1: Base64 encoding
      req.body.attachmentUrl = fileToBase64(req.file.path);
      
      // Clean up file after encoding
      fs.unlinkSync(req.file.path);
      
      // Option 2: If using Cloudinary (comment out Option 1 and uncomment this)
      // req.body.attachmentUrl = req.file.path; // Cloudinary URL
    }

    // Handle subtopics if they're sent as JSON string
    if (req.body.subtopics) {
      req.body.subtopics = JSON.parse(req.body.subtopics);
    }

    const updatedTopic = await Topic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedTopic);
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete topic
// @route DELETE /api/topics/:id
// @access Private
/**
 * Deletes a topic from the database
 * 
 * This controller handles DELETE requests to remove topics. It:
 * 1. Finds the topic by ID from request parameters
 * 2. Validates the topic exists (404 if not found)
 * 3. Verifies the requesting user owns the topic (401 if unauthorized)
 * 4. Deletes the topic if all checks pass
 * 5. Returns the deleted topic ID or appropriate error responses
 * 
 * Request parameters:
 * - id: Topic ID to delete (required)
 * 
 * On success: Returns 200 with deleted topic ID
 * On error: Returns 404 (not found), 401 (unauthorized), or 500 (server error)
 */
const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Check if the topic belongs to the user
    if (topic.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Topic.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle subtopic completion status
// @route PUT /api/topics/:id/subtopics/:subtopicId
// @access Private
/**
 * Toggles the completion status of a subtopic
 * 
 * This controller handles PUT requests to toggle subtopic completion. It:
 * 1. Finds the parent topic by ID from request parameters
 * 2. Validates the topic exists (404 if not found)
 * 3. Verifies the requesting user owns the topic (401 if unauthorized)
 * 4. Locates the specific subtopic using the subtopicId parameter
 * 5. Toggles the subtopic's completed status (true/false)
 * 6. Saves the updated topic and returns it
 * 
 * Request parameters:
 * - id: Parent topic ID (required)
 * - subtopicId: Subtopic ID to toggle (required)
 * 
 * On success: Returns 200 with updated topic object
 * On error: Returns 404 (not found), 401 (unauthorized), or 500 (server error)
 */
const toggleSubtopicCompletion = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Check if the topic belongs to the user
    if (topic.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Find the subtopic
    const subtopic = topic.subtopics.id(req.params.subtopicId);
    
    if (!subtopic) {
      return res.status(404).json({ message: 'Subtopic not found' });
    }

    // Toggle completion status
    subtopic.completed = !subtopic.completed;
    
    await topic.save();
    
    res.status(200).json(topic);
  } catch (error) {
    console.error('Error toggling subtopic completion:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Add attachment to subtopic
// @route POST /api/topics/:id/subtopics/:subtopicId/attachment
// @access Private
const addSubtopicAttachment = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Check if the topic belongs to the user
    if (topic.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Find the subtopic
    const subtopic = topic.subtopics.id(req.params.subtopicId);
    if (!subtopic) {
      return res.status(404).json({ message: 'Subtopic not found' });
    }

    // Handle file upload
    if (req.file) {
      // Option 1: Base64 encoding
      subtopic.attachmentUrl = fileToBase64(req.file.path);
      
      // Clean up file after encoding
      fs.unlinkSync(req.file.path);
      
      // Option 2: If using Cloudinary (comment out Option 1 and uncomment this)
      // subtopic.attachmentUrl = req.file.path; // Cloudinary URL
    } else {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    await topic.save();
    res.status(200).json(topic);
  } catch (error) {
    console.error('Error adding subtopic attachment:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTopic,
  getUserTopics,
  updateTopic,
  deleteTopic,
  toggleSubtopicCompletion,
  addSubtopicAttachment
};
