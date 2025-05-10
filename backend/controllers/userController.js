const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// @desc Register a new user
// @route POST /api/users
// @access Public

const registerUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Check if user exists
        const userExists = await User.findOne({email});

        if(userExists) {
            return res.status(400).json({message: 'User already exists'});
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({
            email,
            password: hashedPassword // in password we store the hashed password, not plaintext
        });

        if(user) {
            res.status(201).json({
                _id: user._id,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({message: 'Invalid user data'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


// @desc Authenticat a user
// @route POST /api/users/login
// @access Public

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Check for user email
        const user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({message: 'Invalid credentials'});
        }

        // compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password); // see if match true

        if(!isMatch) {
            return res.status(400).json({message: 'Invalid credentials'});
        }

        res.json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET || 'defaultsecret', {
        expiresIn: '30d',
    });
};

// exporting the functions to be called in the routes
module.exports = {
    registerUser,
    loginUser,
};