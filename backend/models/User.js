const mongoose = require('mongoose'); // import mongoose
const {Schema} = mongoose; // import Schema from mongoose

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'], // make email required
        unique: true, // make email unique
        lowercase: true, // make email lowercase
        trim: true, // remove whitespace
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: { //here store the hashed password, not plaintext!
        type: String,
        required: [true, 'Password is required'], 
        minlength: [6, 'Password must be at least 6 characters long']
    },
}, {
    timestamps: true // add createdAt and updatedAt fields
});

// Create and export User model
const User = mongoose.model('User', userSchema);
module.exports = User;