const mongoose = require('mongoose');
const {Schema} = mongoose;

const taskSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['pending', 'in progress', 'completed'],
        default: 'pending'
    },
    owner: {
        type: Schema.Types.ObjectId, // reference to the User that is of type id
        ref: 'User',
        required: true // need to set an owner for the task
    }
}, {
    timestamps: true // add createdAt and updatedAt fields
});

// Create and export Task model
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;