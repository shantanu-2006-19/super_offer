import express from 'express';
import { body } from 'express-validator';
import { validateMiddleware } from '../middleware/validationMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { register, login, logout, refreshToken, getMe } from '../controllers/authController.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }),
  body('email').trim().isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['user', 'shop_owner']),
  body('phone').optional({ nullable: true, checkFalsy: true }).isMobilePhone().withMessage('Please provide a valid phone number')
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', authLimiter, registerValidation, validateMiddleware, register);
router.post('/login', authLimiter, loginValidation, validateMiddleware, login);
router.post('/logout', authMiddleware, logout);
router.post('/refresh', refreshToken);
router.get('/me', authMiddleware, getMe);

export default router;

