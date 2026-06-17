import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { verificationAPI } from '../services/api';
import { FiUser, FiMail, FiLock, FiPhone, FiUserPlus, FiShield, FiArrowLeft } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Step 1: Registration form
const RegisterForm = ({ formData, onChange, onSubmit, loading, error }) => {
  const { name, email, password, confirmPassword, phone, role } = formData;

  return (
    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="label">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={onChange}
              className="input pl-10"
              placeholder="Enter your name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="label">Email address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={onChange}
              className="input pl-10"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="label">Phone Number (Optional)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiPhone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={onChange}
              className="input pl-10"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="label">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={onChange}
              className="input pl-10"
              placeholder="Create a password (min 6 chars)"
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="label">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={onChange}
              className="input pl-10"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <div>
          <label className="label">I want to:</label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <label className={`card p-4 cursor-pointer ${role === 'user' ? 'ring-2 ring-primary-500' : ''}`}>
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === 'user'}
                onChange={onChange}
                className="sr-only"
              />
              <div className="text-center">
                <FiUser className="h-8 w-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                <span className="block font-medium">Find Deals</span>
                <span className="text-sm text-gray-500">Browse offers nearby</span>
              </div>
            </label>
            <label className={`card p-4 cursor-pointer ${role === 'shop_owner' ? 'ring-2 ring-primary-500' : ''}`}>
              <input
                type="radio"
                name="role"
                value="shop_owner"
                checked={role === 'shop_owner'}
                onChange={onChange}
                className="sr-only"
              />
              <div className="text-center">
                <FiUserPlus className="h-8 w-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                <span className="block font-medium">Sell Deals</span>
                <span className="text-sm text-gray-500">Promote my shop</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full flex items-center justify-center space-x-2 py-3"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            <FiMail className="h-5 w-5" />
            <span>Continue — Verify Email</span>
          </>
        )}
      </button>

      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
};

// Step 2: OTP verification
const OtpVerifyForm = ({ email, onVerify, onResend, onBack, loading, error, success }) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(otp);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="text-center">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiShield className="h-8 w-8 text-primary-600" />
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          We sent a 6-digit OTP to
        </p>
        <p className="font-semibold text-gray-900 dark:text-white">{email}</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div>
        <label htmlFor="otp" className="label">Enter OTP</label>
        <input
          id="otp"
          type="text"
          inputMode="numeric"
          maxLength={6}
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          className="input text-center text-2xl tracking-widest font-bold"
          placeholder="000000"
          autoFocus
        />
        <p className="text-xs text-gray-500 mt-1">OTP expires in 10 minutes</p>
      </div>

      <button
        type="submit"
        disabled={loading || otp.length < 6}
        className="btn btn-primary w-full flex items-center justify-center space-x-2 py-3"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            <FiShield className="h-5 w-5" />
            <span>Verify & Create Account</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 flex items-center space-x-1"
        >
          <FiArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={onResend}
          className="text-primary-600 hover:text-primary-500 font-medium"
        >
          Resend OTP
        </button>
      </div>
    </form>
  );
};

// Main Register component
const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = form, 2 = otp
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // Step 1: validate form and send OTP
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verificationAPI.requestOtp(formData.email, 'email_verification');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: verify OTP then register
  const handleOtpVerify = async (otp) => {
    setLoading(true);
    setError('');

    try {
      // Verify OTP first
      await verificationAPI.verifyOtp(formData.email, otp, 'email_verification');

      // OTP verified — now register
      const { name, email, password, phone, role } = formData;
      const result = await register({ name, email, password, phone, role });

      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setError('');
    setOtpSuccess('');
    try {
      await verificationAPI.requestOtp(formData.email, 'email_verification');
      setOtpSuccess('A new OTP has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {step === 1 ? 'Create Account' : 'Verify Your Email'}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {step === 1 ? 'Join Super Offer today' : 'Enter the OTP sent to your email'}
            </p>

            {/* Step indicator */}
            <div className="flex items-center justify-center mt-4 space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <div className={`h-1 w-12 rounded ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
            </div>
          </div>

          {step === 1 ? (
            <RegisterForm
              formData={formData}
              onChange={onChange}
              onSubmit={handleFormSubmit}
              loading={loading}
              error={error}
            />
          ) : (
            <OtpVerifyForm
              email={formData.email}
              onVerify={handleOtpVerify}
              onResend={handleResend}
              onBack={() => { setStep(1); setError(''); setOtpSuccess(''); }}
              loading={loading}
              error={error}
              success={otpSuccess}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
