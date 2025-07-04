// src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo.png';
import { useAuth } from '../contexts/AuthContext';
import BackgroundBubbles from '../components/BackgroundBubbles';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const validatePhoneNumber = (phone) => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10 ? digitsOnly : null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!agree) {
      toast.error('Please agree to the terms and privacy policy');
      return;
    }
    if (!phoneNumber || !password) {
      toast.error('Please enter both phone number and password');
      return;
    }

    const formattedPhone = validatePhoneNumber(phoneNumber);
    if (!formattedPhone) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setIsLoading(true);
      const result = await login({ phoneNumber: formattedPhone, password });
      if (result.success) {
        toast.success('Login successful!');
      } else {
        toast.error('Invalid phone number or password');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blueGradient flex flex-col justify-end relative">
      <BackgroundBubbles />
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <img src={logo} alt="Ful2Win Logo" className="w-45 md:w-44 mb-4" />
        <p className="text-red-500 text-sm font-semibold text-center">
          Entertainment. <span className="text-yellow-300">Earning.</span> <span className="text-pink-400">Fame</span>
        </p>
      </div>

      <div className="bg-white rounded-t-3xl px-6 py-8 w-full max-w-md mx-auto shadow-xl">
        <h2 className="text-2xl font-semibold text-gray-700 mb-5">Hello Again!</h2>
        <p className="text-gray-500 mb-5">Login to continue</p>

        <form onSubmit={handleLogin}>
          {/* Phone field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 10-digit phone number"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-blue-300"
              maxLength="10"
              required
            />
          </div>

          {/* Password field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-blue-300"
              required
            />
          </div>

          {/* Forgot password link */}
          <div className="text-right text-sm mb-4">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Terms agreement */}
          <div className="flex items-center mb-4 text-sm">
            <input
              type="checkbox"
              checked={agree}
              onChange={e => setAgree(e.target.checked)}
              className="mr-2"
              required
            />
            <label className="text-gray-700">
              I agree to the{' '}
              <Link to="/terms" className="text-blue-600 hover:underline">Terms</Link> and{' '}
              <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-white ${
              isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-500">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
