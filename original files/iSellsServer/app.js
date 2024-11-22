require('dotenv').config(); // Ensure environment variables are loaded
require('./db/conn'); // Database connection

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authenticate = require('./middleware/authenticate');
const Router = require('./routers/Router'); // Ensure this file contains all routes

const app = express();
const port = process.env.PORT || 8005;

// Middleware setup
app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser()); // Parse cookies in requests

// Allowed origins for CORS (Update this with correct origins)
const allowedOrigins = [
    'https://isells-user.vercel.app',    // Frontend URL
    // 'https://isells-user-ashishs-projects-0746fd98.vercel.app', // Another allowed frontend URL if needed
];

// CORS configuration to allow credentials (cookies) and specific origin
app.use(cors({
    origin: (origin, callback) => {
        // Allow the request from the allowed origins or no origin (for same-origin requests)
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);  // Allow the request
        } else {
            callback(new Error('Not allowed by CORS'));  // Reject if origin is not allowed
        }
    },
    credentials: true,  // Allow cookies and credentials with the request
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Supported HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],  // Specify allowed headers
}));

// Use all routes from the Router module
app.use(Router);

// Example of a protected route using the authenticate middleware
app.get('/validuser', authenticate, (req, res) => {
    res.json(req.rootUser); // Respond with the authenticated user data
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ error: 'CORS Error', message: err.message });
    }
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port number ${port}`);
});
