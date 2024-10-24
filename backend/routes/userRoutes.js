import express from 'express';
import { 
    registerUser, 
    loginUser, 
    getCurrentUser,
    createUserWithRole 
} from '../controllers/userController.js';
import validateToken from '../middleware/validateToken.js';
import checkPermission from '../middleware/checkPermissions.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', validateToken, getCurrentUser);
router.post('/create-with-role', validateToken, createUserWithRole);

export default router;