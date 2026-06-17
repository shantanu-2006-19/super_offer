import mongoose from 'mongoose';

const otpVerificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  email: { type: String, required: true, lowercase: true, trim: true },

  otp: { type: String, required: true },
  purpose: {
    type: String,
    enum: ['email_verification', 'login'],
    required: true
  },

  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now, index: true },

  // Consumed timestamp (null = not yet used)
  consumedAt: { type: Date, default: null }
});

// TTL index: auto-delete after expiresAt
otpVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OtpVerification = mongoose.model('OtpVerification', otpVerificationSchema);
export default OtpVerification;

