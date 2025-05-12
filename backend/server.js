// Essential imports
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Fix import directly without destructuring
const cors = require('cors');

// Load environment variables
dotenv.config();

// initialize express app
const app = express();

// connect database
connectDB();

// setup middleware
// CORS middleware - place this BEFORE any route definitions

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 
//     'taskify-frontend-j88j0jevz-andys-projects-26ad8edd.vercel.app');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, 
//     Accept, Authorization');
    
//     // Handle preflight requests
//     if (req.method === 'OPTIONS') {
//       return res.status(200).end();
//     }
    
//     next();
// });

app.use(cors({
    origin: ['http://localhost:3000', 
             'https://taskify-frontend-j88j0jevz-andys-projects-26ad8edd.vercel.app',
             'https://taskify-frontend-weld.vercel.app',
             'https://taskify-frontend-hpkob9c7k-andys-projects-26ad8edd.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Basic route
app.get('/', (req, res) => {
    res.json({message: 'Welcome to Taskify API'}); // welcome endpoint at the root path
});

// Routes
app.use('/api/users', require('./routes/userRoutes')); // send /api/users requests to the userRoutes
app.use('/api/tasks', require('./routes/taskRoutes')); // same but for tasks
app.use('/api/notifications', require('./routes/notificationRoutes')); // notifications route

// Define port
const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});