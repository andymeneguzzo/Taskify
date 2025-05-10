const express = require('express');
const router = express.Router();
const {registerUser, loginUser, getMe} = require('../controllers/userController');
const {protect} = require('../middleware/authMiddleware');


// Register route
router.post('/', registerUser);

// Login route
router.post('/login', loginUser);

// protected routes
router.get('/me', protect, getMe); // protect the route with the auth middleware, so only authorized users can access the profile with user data

module.exports = router;
