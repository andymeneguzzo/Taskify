const Task = require('../models/Task');

// @desc Get user notifications (reminders, due today, overdue)
// @route GET /api/notifications
// @access Private
/**
 * Retrieves and categorizes task notifications for the authenticated user.
 * 
 * This function:
 * 1. Gets current time and calculates time ranges (today, next 24 hours)
 * 2. Queries tasks that are:
 *    - Not completed
 *    - Either:
 *      * Have reminders in next 24 hours
 *      * Are due today
 *      * Are overdue
 * 3. Processes and categorizes tasks into:
 *    - Reminders (tasks with upcoming reminders)
 *    - Due today (tasks due today)
 *    - Overdue (tasks past due date)
 * 4. Converts dates to ISO strings for frontend consistency
 * 5. Marks retrieved tasks as notified to prevent duplicate notifications
 * 
 * Returns an object with three arrays: reminders, dueToday, overdue
 */
const getNotifications = async (req, res) => {
    try {
        const now = new Date();
        
        // Start of today (midnight)
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);
        
        // End of today (23:59:59)
        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);
        
        // 24 hours from now
        const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        
        // Find tasks that are:
        // 1. Reminder within next 24 hours
        // 2. Due today
        // 3. Overdue
        // 4. Not completed
        const notifications = await Task.find({
            owner: req.user._id,
            status: { $ne: 'completed' },
            $or: [
                { reminderDate: { $gte: now, $lte: in24h } },
                { dueDate: { $gte: startOfToday, $lte: endOfToday } },
                { dueDate: { $lt: now } }
            ]
        }).lean();
        
        // Process and categorize notifications
        const result = {
            reminders: [],
            dueToday: [],
            overdue: []
        };
        
        // Process task dates and categorize them
        for (const task of notifications) {
            const processedTask = { ...task };
            
            // Convert dates to ISO strings for consistent handling in frontend
            if (task.dueDate) {
                processedTask.dueDate = task.dueDate.toISOString();
            }
            
            if (task.reminderDate) {
                processedTask.reminderDate = task.reminderDate.toISOString();
            }
            
            // Categorize task
            if (task.dueDate && task.dueDate < now) {
                result.overdue.push(processedTask);
            } else if (task.dueDate && task.dueDate >= startOfToday && task.dueDate <= endOfToday) {
                result.dueToday.push(processedTask);
            }
            
            if (task.reminderDate && task.reminderDate >= now && task.reminderDate <= in24h) {
                result.reminders.push(processedTask);
            }
        }
        
        // Mark tasks as notified
        if (notifications.length > 0) {
            const taskIds = notifications.map(task => task._id);
            await Task.updateMany(
                { _id: { $in: taskIds } },
                { $set: { notified: true } }
            );
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error retrieving notifications:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc Mark all notifications as read
// @route PUT /api/notifications/mark-read
// @access Private
/**
 * Marks all notifications as read for the authenticated user
 * 
 * This controller:
 * 1. Finds all tasks belonging to the current user that have notifications (notified: true)
 * 2. Updates them to mark notifications as read (notified: false)
 * 3. Returns success response if successful
 * 4. Handles any errors that occur during the process
 * 
 * @param {Object} req - Express request object containing user info
 * @param {Object} res - Express response object
 */
const markNotificationsAsRead = async (req, res) => {
    try {
        await Task.updateMany(
            { owner: req.user._id, notified: true },
            { $set: { notified: false } }
        );
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getNotifications,
    markNotificationsAsRead
};