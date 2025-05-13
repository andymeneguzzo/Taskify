const express = require('express');
const router = express.Router();
const {
  createTopic,
  getUserTopics,
  updateTopic,
  deleteTopic,
  toggleSubtopicCompletion
} = require('../controllers/topicController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Topic Routes
 * 
 * Defines all routes related to topic management with authentication protection.
 * All routes are protected by the auth middleware which verifies JWT tokens.
 * 
 * Routes:
 * GET / - Get all topics for authenticated user
 * POST / - Create a new topic
 * PUT /:id - Fully update a topic by ID
 * PATCH /:id - Partially update a topic by ID  
 * DELETE /:id - Delete a topic by ID
 * PATCH /:id/subtopics/:subtopicId - Toggle completion status of a subtopic
 * 
 * All routes require valid JWT authentication token in Authorization header
 */
router.use(protect); // Apply auth middleware to all topic routes

// Base topic routes
router.route('/')
  .get(getUserTopics)    // GET /api/topics - Get user's topics
  .post(createTopic);    // POST /api/topics - Create new topic

// Topic CRUD operations by ID  
router.route('/:id')
  .put(updateTopic)     // PUT /api/topics/:id - Full update
  .patch(updateTopic)   // PATCH /api/topics/:id - Partial update
  .delete(deleteTopic); // DELETE /api/topics/:id - Delete topic

// Subtopic specific operation
router.patch('/:id/subtopics/:subtopicId', toggleSubtopicCompletion); // PATCH /api/topics/:id/subtopics/:subtopicId - Toggle subtopic completion

module.exports = router;
