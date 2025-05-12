const express = require('express');
const router = express.Router();
const { getNotifications, markNotificationsAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

router.get('/', getNotifications);
router.put('/mark-read', markNotificationsAsRead);

module.exports = router;
