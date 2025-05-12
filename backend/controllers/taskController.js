const Task = require('../models/Task');

// @desc Get user tasks
// @route GET /api/tasks
// @access Private

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({owner: req.user._id});
        console.log('Tasks retrieved:', tasks);
        res.status(200).json(tasks);
    } catch(error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({message: error.message});
    }
};

// @desc Create a new task
// @route POST /api/tasks
// @access Private

const createTask = async (req, res) => {
    try {
        // Add logging to see what's being received
        console.log('Received task data:', req.body);
        
        const {title, description, status, category, dueDate, reminderDate} = req.body;

        if(!title) {
            return res.status(400).json({message: 'Please add a title'}); // 400 is the status code for bad request
        }

        // Create task object explicitly listing each field
        const taskData = {
            title,
            description,
            status,
            category,
            owner: req.user._id
        };
        
        // Only add dates if they exist and are valid
        if (dueDate) {
            taskData.dueDate = new Date(dueDate);
        }
        
        if (reminderDate) {
            taskData.reminderDate = new Date(reminderDate);
        }
        
        console.log('Creating task with data:', taskData);
        
        const task = await Task.create(taskData);
        console.log('Created task:', task);
        
        res.status(201).json(task); // 201 is the status code for created
    } catch(error) {
        console.error('Error creating task:', error);
        res.status(500).json({message: error.message}); // 500 is the status code for internal server error
    }
};

// @desc Update task
// @route PUT /api/tasks/:id
// @access Private

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({message: 'Task not found'}); // 404 is the status code for not found
        }

        // Check if the task belongs to the user who wants to update it
        if(task.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({message: 'User not authorized'}); // 401 is the status code for unauthorized
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );

        res.status(200).json(updatedTask);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

// @desc Delete task
// @route DELETE /api/tasks/:id
// @access Private

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({message: 'Task not found'});
        }

        // Check if the task belongs to the user who wants to delete it
        if(task.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({message: 'User not authorized'});
        }

        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({id: req.params.id});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
};