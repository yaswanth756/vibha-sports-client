import React, { useState } from 'react';
import { Mail, Lock, User, Phone, Send, LogIn, UserPlus, LogOut } from 'lucide-react';
// Adjust the import based on your project structure
const BACKEND_API = import.meta.env.VITE_BACKEND_API;
const LoginForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    name: '',
    phone: '',
  });


  const [step, setStep] = useState(1); // 1: Email input, 2: OTP input (and name/phone for signup)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };


  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError('Email is required.');
      return;
    }
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_API}/api/auth/checkUser?email=${encodeURIComponent(formData.email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send OTP');
      }

      const data = await response.json();
      setStep(2); // Move to OTP input step
      if (data.isNew && !isSignup) {
        setIsSignup(true); // Switch to signup if user doesn't exist
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email || !formData.otp || (isSignup && (!formData.name || !formData.phone))) {
      setError('All required fields must be filled.');
      return;
    }

    setLoading(true);
    const endpoint = isSignup ? '/register' : '/login';
    const payload = isSignup
      ? { email: formData.email, otp: formData.otp, name: formData.name, phone: formData.phone, Admin: false }
      : { email: formData.email, otp: formData.otp };

    try {
      const response = await fetch(`${BACKEND_API}/api/auth${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process request');
      }

      const data = await response.json();
      const { token, message } = data;

      // Store JWT in localStorage
      localStorage.setItem('token', token);
      setSuccess(message); // "Login successful" or "Account created!"

      // Reset form and redirect (or update app state)
      setFormData({ email: '', otp: '', name: '', phone: '' });
      setStep(1);
      setIsSignup(false);



      // Example: Redirect to dashboard (uncomment if using react-router-dom)
      setTimeout(() => {
        window.location.href = '/'; // Redirect to a dashboard or home page
      }, 1000);
      //window.location.href = '/';
    } catch (err) {
      setError(err.message || 'Failed to process request');
    } finally {
      setLoading(false);
  
    }
  };

  const handleToggle = () => {
    setIsSignup(!isSignup);
    setError('');
    setSuccess('');
    setFormData({ ...formData, name: '', phone: '', otp: '' });
    setStep(1); // Reset to email input step
  };

  const handleBack = () => {
    setStep(1);
    setError('');
    setSuccess('');
    setFormData({ ...formData, otp: '', name: '', phone: '' });
  };

  return (
    <div className="p-6 w-full max-w-sm sm:max-w-md mx-auto bg-white rounded-lg ">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center flex items-center justify-center">
        {isSignup ? (
          <>
          
            Sign Up
          </>
        ) : (
          <>
           
            Login
          </>
        )}
      </h2>
      <form onSubmit={step === 1 ? handleSendOtp : handleSubmit} className="space-y-4">
        {error && (
          <p className="text-red-500 text-sm text-center bg-red-100 p-2 rounded">{error}</p>
        )}
        {success && (
          <p className="text-spring-leaves-600 text-sm text-center bg-spring-leaves-100 p-2 rounded">{success}</p>
        )}

        {step === 1 ? (
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="flex items-center">
              <Mail className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spring-leaves-500 text-gray-800 text-sm sm:text-base disabled:bg-gray-100"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 text-center mb-4">
              OTP sent to <span className="font-medium text-spring-leaves-500">{formData.email}</span>
            </p>
            <div className="relative">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                OTP
              </label>
              <div className="flex items-center">
                <Lock className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spring-leaves-500 text-gray-800 text-sm sm:text-base disabled:bg-gray-100"
                  placeholder="Enter the OTP"
                  disabled={loading}
                />
              </div>
            </div>
            {isSignup && (
              <>
                <div className="relative">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <div className="flex items-center">
                    <User className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spring-leaves-500 text-gray-800 text-sm sm:text-base disabled:bg-gray-100"
                      placeholder="Enter your name"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <div className="flex items-center">
                    <Phone className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spring-leaves-500 text-gray-800 text-sm sm:text-base disabled:bg-gray-100"
                      placeholder="Enter your phone number"
                      disabled={loading}
                    />
                  </div>
                </div>
              </>
            )}
            <button
              type="button"
              onClick={handleBack}
              className="w-full py-2 px-4 bg-spring-leaves-50 text-gray-700  hover:bg-spring-leaves-200 transition duration-200 text-sm sm:text-base flex items-center justify-center"
              disabled={loading}
            >
             
              Back to Email
            </button>
            
          </>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-spring-leaves-600 text-white  transition duration-200 text-sm sm:text-base  flex items-center justify-center hover:bg-spring-leaves-800"
          disabled={loading}
        >
          {loading ? (
            'Processing...'
          ) : step === 1 ? (
            <>
              <Send className="w-5 h-5 mr-2" />
              Send OTP
            </>
          ) : isSignup ? (
            <>
              <UserPlus className="w-5 h-5 mr-2" />
              Sign Up
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5 mr-2" />
              Login
            </>
          )}
        </button>
      </form>
      <p className="text-sm text-center text-gray-600 mt-4 flex items-center justify-center">
        {isSignup ? 'Already have an account?' : "Don't have an account?"}
        <button
          onClick={handleToggle}
          className="text-spring-leaves-500 hover:underline ml-1 focus:outline-none flex items-center"
          disabled={loading}
        >
          {isSignup ? (
            <>
              <LogIn className="w-4 h-4 mr-1" />
              Login
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-1" />
              Sign Up
            </>
          )}
        </button>
      </p>
    </div>
  );
};

export default LoginForm;