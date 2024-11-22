const jwt = require('jsonwebtoken');
const USER = require('../models/userSchema');
const secretKey = process.env.KEY;

const authenticate = async (req, res, next) => {
    try {
        console.log('Cookies:', req.cookies);
        const token = req.cookies.iSells;

        if (!token) {
            console.log('No token provided');
            return res.status(401).send('Unauthorized: No token provided');
        }

        // Try to verify the token
        let verifiedToken;
        try {
            verifiedToken = jwt.verify(token, secretKey);
        } catch (err) {
            // Handle token expiration or invalid token error
            console.error('Invalid or expired token:', err);
            return res.status(401).send('Unauthorized: Invalid or expired token');
        }

        console.log('Verified Token:', verifiedToken);

        // Look for the user based on the verified token's _id and token in the user's tokens array
        const rootUser = await USER.findOne({ _id: verifiedToken._id, "tokens.token": token });

        if (!rootUser) {
            console.log('User not found');
            return res.status(401).send('Unauthorized: User not found');
        }

        // Attach user info to request object for further use in other routes
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.log('Error:', error.message || error);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = authenticate;
