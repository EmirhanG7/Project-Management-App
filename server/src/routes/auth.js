import express from 'express';
import {
  register,
  login,
  me,
  logout,
  verifyEmail,
  resendVerification,
  updateProfile, changePassword
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', verifyToken, me);
router.patch('/me', verifyToken, updateProfile)
router.patch('/me/password', verifyToken, changePassword)

export default router;
