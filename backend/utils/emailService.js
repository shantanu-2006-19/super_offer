import nodemailer from 'nodemailer';

const createTransporter = () => {
  const { EMAIL_FROM, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!EMAIL_FROM || !SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      'Email is not configured. Set EMAIL_FROM, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in backend/.env'
    );
  }

  const port = Number(SMTP_PORT);

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    // port 465 = SSL (secure:true), port 587 = STARTTLS (secure:false)
    secure: port === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    },
    // Helps with self-signed certs in dev; remove in strict production
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production'
    }
  });
};

export const sendOtpEmail = async ({ toEmail, otp, purpose }) => {
  const transporter = createTransporter();

  // Verify SMTP connection before attempting to send
  try {
    await transporter.verify();
  } catch (err) {
    throw new Error(`SMTP connection failed: ${err.message}`);
  }

  const subject =
    purpose === 'login'
      ? 'Your Super Offer login OTP'
      : 'Verify your email - Super Offer';

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;">
      <h2 style="color:#4f46e5;margin-bottom:8px;">Super Offer</h2>
      <p style="color:#374151;">Your one-time password (OTP) is:</p>
      <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#111827;margin:16px 0;">${otp}</div>
      <p style="color:#6b7280;font-size:14px;">This code expires in ${process.env.OTP_EXPIRE_MINUTES || 10} minutes.</p>
      <p style="color:#6b7280;font-size:14px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  const text = `Your Super Offer OTP is: ${otp}\n\nExpires in ${process.env.OTP_EXPIRE_MINUTES || 10} minutes. If you didn't request this, ignore this email.`;

  await transporter.sendMail({
    from: `"Super Offer" <${process.env.EMAIL_FROM}>`,
    to: toEmail,
    subject,
    text,
    html
  });
};
