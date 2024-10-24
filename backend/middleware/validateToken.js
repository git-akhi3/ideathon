import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler"; // Ensure asyncHandler is correctly imported
import User from "../models/userModel.js"; // Import the User model

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;
    console.log("Auth header:", authHeader);

    // Check if the authorization header is present and starts with 'Bearer'
    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            // Extract token from the Bearer token format
            token = authHeader.split(' ')[1];
            console.log("Token extracted");
            // Verify token and decode the payload
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            console.log("Decoded token:", decoded);
            // Find the user from the decoded token, excluding the password field
            req.user = await User.findById(decoded.user.id).select('-password');
            console.log("User found:", req.user);
            // Proceed to the next middleware if the token is valid
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            return res.json({ message: 'Not authorized, token failed' });
        }
    } else {
        // If no token is provided, respond with a 401 status
        res.status(401);
        return res.json({ message: 'Not authorized, no token provided' });
    }
});

export default validateToken;
