const express = require('express');
const router = express.Router();
const {
    getTasks,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/taskController');
const {protect} = require('../middleware/authMiddleware');

// protect all task routes with the auth middleware
router.use(protect);

// Get all tasks and create a new task
router.route('/')
    .get(getTasks)
    .post(createTask);

// Update and delete a task by ID
router.route('/:id')
    .put(updateTask)
    .patch(updateTask) // patch method is used to update a task
    .delete(deleteTask);

module.exports = router;