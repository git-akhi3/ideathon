import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register User
export const registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'elder' // Default to elder if no role specified
        });

        if (user) {
            const token = jwt.sign({
                user: {
                    username: user.username,
                    email: user.email,
                    id: user._id,
                    role: user.role,
                    permission: user.permission
                },
            }, process.env.SECRET_KEY, { expiresIn: '1h' });

            return res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                permission: user.permission,
                token: token
            });
        }
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: 'Server error during registration' });
    }
};

// Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({
                user: {
                    username: user.username,
                    email: user.email,
                    id: user._id,
                    role: user.role,
                    permission: user.permission
                },
            }, process.env.SECRET_KEY, { expiresIn: '1h' });

            return res.status(200).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                permission: user.permission,
                token: token
            });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: 'Server error during login' });
    }
};

// Get Current User Profile
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Get current user error:", error);
        res.status(500).json({ message: 'Server error while fetching user profile' });
    }
};

export const getAllElders = async (req, res) => {
    try {
        const elders = await User.find({ role: 'elder' }).select('-password');
        res.status(200).json(elders);
    } catch (error) {
        console.error("Get all elders error:", error);
        res.status(500).json({ message: 'Server error while fetching elders' });
    }
};

// Create User with Role (Admin only)
export const createUserWithRole = async (req, res) => {

    console.log("Request body:", req.body);
    console.log("Current user:", req.user); 

    const { username, email, password, role } = req.body;
    
    if (!username || !email || !password || !role) {
        console.log("Missing fields:", { username, email, password, role });
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    try {
        // Check if requester is admin
        if (req.user.role !== 'admin') {
            console.log("User role:", req.user.role);
            return res.status(403).json({ message: 'Not authorized to create users with roles' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log("User exists:", userExists);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Validate role
        if (!['elder', 'admin', 'caretaker'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed successfully");

        console.log("Attempting to create user with data:", {
            username,
            email,
            role,
        });
        
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role
        });

        console.log("User created successfully:", user);

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                permission: user.permission
            });
        }
    } catch (error) {
        console.error("Create user with role error:", error);
        res.status(500).json({ message: 'Server error while creating user' ,
        error: error.message
        });
    }
};

// Update User Role (Admin only)
export const updateUserRole = async (req, res) => {
    const { userId, newRole } = req.body;

    try {
        // Check if requester is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update user roles' });
        }

        // Validate role
        if (!['elder', 'admin', 'caretaker'].includes(newRole)) {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = newRole;
        await user.save();

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            permission: user.permission
        });
    } catch (error) {
        console.error("Update user role error:", error);
        res.status(500).json({ message: 'Server error while updating user role' });
    }
};