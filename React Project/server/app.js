require('dotenv').config();
require('./db/conn');
const express = require('express');
const mongoose = require('mongoose');


const cors = require('cors');
const cookieParser = require('cookie-parser');
const authenticate = require('./middleware/authenticate');
const app = express();
const port = process.env.PORT || 8005;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000', // Update with your client URL
    credentials: true, // Allow credentials (cookies) to be sent
}));

// Protected route
app.use('/protected-route', authenticate, (req, res) => {
    res.send('This is a protected route');
});

// Routes
const Router = require('./routers/Router');
app.use(Router);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port number ${port}`);
});
