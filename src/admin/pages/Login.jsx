import React, { useState } from 'react';
import { Mail, Lock, User, Phone, Send, LogIn, UserPlus, ArrowLeftCircle } from 'lucide-react';
const BACKEND_API = import.meta.env.VITE_BACKEND_API;
const AdminLogin = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ email: '', otp: '', name: '', phone: '' });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateEmail = (email) => /^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.email || !validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_API}/api/auth/checkUser?email=${encodeURIComponent(formData.email)}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

      setIsSignup(data.isNew);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.otp || (isSignup && (!formData.name || !formData.phone))) {
      setError('All required fields must be filled.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isSignup ? '/register' : '/login';
      const payload = isSignup
        ? { email: formData.email, otp: formData.otp, name: formData.name, phone: formData.phone,Admin:true }
        : { email: formData.email, otp: formData.otp };

      const res = await fetch(`${BACKEND_API}/api/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('token', data.token);
      setSuccess(data.message);

      setTimeout(() => {
        window.location.href = '/admin';
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setFormData({ ...formData, otp: '', name: '', phone: '' });
    setError('');
    setSuccess('');
  };

  const toggleFormType = () => {
    setIsSignup(!isSignup);
    setFormData({ ...formData, name: '', phone: '', otp: '' });
    setStep(1);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-spring-leaves-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-center text-spring-leaves-800">
          {isSignup ? 'Admin Sign Up' : 'Admin Login'}
        </h2>

        {error && <div className="text-red-600 bg-red-100 p-2 text-sm rounded">{error}</div>}
        {success && <div className="text-green-700 bg-green-100 p-2 text-sm rounded">{success}</div>}

        <form onSubmit={step === 1 ? handleSendOtp : handleSubmit} className="space-y-4">
          {step === 1 ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-spring-leaves-500"
                  placeholder="admin@example.com"
                  disabled={loading}
                />
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-center text-gray-600">
                OTP sent to <span className="font-semibold">{formData.email}</span>
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700">OTP</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    className="pl-10 w-full py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-spring-leaves-500"
                    placeholder="Enter OTP"
                    disabled={loading}
                  />
                </div>
              </div>

              {isSignup && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10 w-full py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-spring-leaves-500"
                        placeholder="Admin Name"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10 w-full py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-spring-leaves-500"
                        placeholder="Phone number"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={handleBack}
                className="w-full flex justify-center items-center text-gray-600 hover:text-gray-800 text-sm"
                disabled={loading}
              >
                <ArrowLeftCircle className="w-4 h-4 mr-1" />
                Back to Email
              </button>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-spring-leaves-600 hover:bg-spring-leaves-700 text-white font-semibold py-2 rounded-md transition duration-200 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? 'Processing...' : step === 1 ? <><Send className="w-4 h-4 mr-1" /> Send OTP</> : isSignup ? <><UserPlus className="w-4 h-4 mr-1" /> Sign Up</> : <><LogIn className="w-4 h-4 mr-1" /> Login</>}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          {isSignup ? 'Already an admin?' : 'New Admin?'}
          <button onClick={toggleFormType} className="ml-2 text-spring-leaves-600 font-medium hover:underline" disabled={loading}>
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
