const express = require('express');
const router = express.Router();
const {
  createTopic,
  getUserTopics,
  updateTopic,
  deleteTopic,
  toggleSubtopicCompletion,
  addSubtopicAttachment
} = require('../controllers/topicController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
// Use this if you want Cloudinary
// const { uploadToCloudinary } = require('../config/cloudinary');

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
  .post(upload.single('attachment'), createTopic);
  // If using Cloudinary:
  // .post(uploadToCloudinary.single('attachment'), createTopic);

// Topic CRUD operations by ID  
router.route('/:id')
  .put(upload.single('attachment'), updateTopic)
  .patch(upload.single('attachment'), updateTopic)
  .delete(deleteTopic);
  // If using Cloudinary:
  // .put(uploadToCloudinary.single('attachment'), updateTopic)
  // .patch(uploadToCloudinary.single('attachment'), updateTopic)

// Subtopic specific operation
router.patch('/:id/subtopics/:subtopicId', toggleSubtopicCompletion); // PATCH /api/topics/:id/subtopics/:subtopicId - Toggle subtopic completion

// Subtopic attachment
router.post(
  '/:id/subtopics/:subtopicId/attachment',
  upload.single('attachment'),
  addSubtopicAttachment
);
// If using Cloudinary:
// router.post(
//   '/:id/subtopics/:subtopicId/attachment',
//   uploadToCloudinary.single('attachment'),
//   addSubtopicAttachment
// );

module.exports = router;
