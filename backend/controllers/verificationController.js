import User from '../models/User.js';
import OtpVerification from '../models/OtpVerification.js';
import { generateOtp } from '../utils/otp.js';
import { sendOtpEmail } from '../utils/emailService.js';

const getOtpTtlMs = () => {
  const v = process.env.OTP_EXPIRE_MINUTES;
  const minutes = v ? Number(v) : 10;
  return minutes * 60 * 1000;
};

// @desc    Request an OTP to be sent to email
// @route   POST /api/verification/otp/request
// @access  Public
export const requestEmailOtp = async (req, res, next) => {
  try {
    const { email, purpose } = req.body;

    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!normalizedEmail) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    if (!purpose || !['login', 'email_verification'].includes(purpose)) {
      return res.status(400).json({ success: false, message: 'Invalid purpose' });
    }

    // For login OTP: user must exist
    if (purpose === 'login') {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        // Don't leak whether user exists — return same success response
        return res.json({
          success: true,
          message: 'If an account exists, an OTP has been sent',
          data: { expiresInMinutes: Math.round(getOtpTtlMs() / 60000) }
        });
      }
    }

    // Throttle: don't allow resend within 60 seconds
    const recentOtp = await OtpVerification.findOne({
      email: normalizedEmail,
      purpose,
      consumedAt: null,
      createdAt: { $gt: new Date(Date.now() - 60 * 1000) }
    });

    if (recentOtp) {
      return res.status(429).json({
        success: false,
        message: 'Please wait 60 seconds before requesting another OTP'
      });
    }

    const user = await User.findOne({ email: normalizedEmail });
    const otp = generateOtp(6);
    const expiresAt = new Date(Date.now() + getOtpTtlMs());

    // Remove older OTPs for same email & purpose
    await OtpVerification.deleteMany({ email: normalizedEmail, purpose });

    await OtpVerification.create({
      user: user?._id || null,
      email: normalizedEmail,
      otp,
      purpose,
      expiresAt
    });

    // Send OTP email
    await sendOtpEmail({ toEmail: normalizedEmail, otp, purpose });

    return res.json({
      success: true,
      message: 'OTP sent to your email',
      data: { expiresInMinutes: Math.round(getOtpTtlMs() / 60000) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify an OTP
// @route   POST /api/verification/otp/verify
// @access  Public
export const verifyEmailOtp = async (req, res, next) => {
  try {
    const { email, otp, purpose } = req.body;

    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    if (!purpose || !['login', 'email_verification'].includes(purpose)) {
      return res.status(400).json({ success: false, message: 'Invalid purpose' });
    }

    const otpRecord = await OtpVerification.findOne({
      email: normalizedEmail,
      purpose,
      consumedAt: null,
      otp: String(otp).trim()
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    // Mark OTP as consumed
    otpRecord.consumedAt = new Date();
    await otpRecord.save();

    // If email_verification purpose, mark user as verified (if they already exist)
    if (purpose === 'email_verification') {
      const user = await User.findOne({ email: normalizedEmail });
      if (user) {
        user.emailVerified = true;
        await user.save();
      }
    }

    return res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    next(error);
  }
};
