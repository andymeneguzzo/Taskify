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
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'asap'],
        default: 'medium'
    },
    category: {
        type: String,
        enum: ['general', 'work', 'personal', 'education', 'health'],
        default: 'general'
    },
    dueDate: {
        type: Date,
        default: null
    },
    reminderDate: {
        type: Date,
        default: null
    },
    notified: {
        type: Boolean,
        default: false
    },
    owner: {
        type: Schema.Types.ObjectId, // reference to the User that is of type id
        ref: 'User',
        required: true // need to set an owner for the task
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }, // Enable virtuals when converting to JSON
    toObject: { virtuals: true } // Enable virtuals when converting to objects
});

// Create and export Task model
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;