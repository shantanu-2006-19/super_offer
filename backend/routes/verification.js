import express from 'express';
import { body } from 'express-validator';
import { validateMiddleware } from '../middleware/validationMiddleware.js';
import { otpLimiter } from '../middleware/rateLimiter.js';
import {
  requestEmailOtp,
  verifyEmailOtp
} from '../controllers/verificationController.js';

const router = express.Router();

// POST /api/verification/otp/request
router.post(
  '/otp/request',
  otpLimiter,
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Valid email is required')
      .normalizeEmail(),
    body('purpose')
      .notEmpty().withMessage('Purpose is required')
      .isIn(['login', 'email_verification']).withMessage('Invalid purpose')
  ],
  validateMiddleware,
  requestEmailOtp
);

// POST /api/verification/otp/verify
router.post(
  '/otp/verify',
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Valid email is required')
      .normalizeEmail(),
    body('purpose')
      .notEmpty().withMessage('Purpose is required')
      .isIn(['login', 'email_verification']).withMessage('Invalid purpose'),
    body('otp')
      .notEmpty().withMessage('OTP is required')
      .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
      .isNumeric().withMessage('OTP must be numeric')
  ],
  validateMiddleware,
  verifyEmailOtp
);

export default router;
