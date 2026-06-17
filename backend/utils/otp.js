import crypto from 'crypto';

export const generateOtp = (length = 6) => {
  // Numeric OTP
  const max = 10 ** length;
  const otp = crypto.randomInt(0, max);
  return otp.toString().padStart(length, '0');
};

