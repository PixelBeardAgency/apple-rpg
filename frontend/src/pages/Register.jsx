// Register Page
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sword, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

// Use relative URLs on production (Vercel), localhost for development
const API_URL = import.meta.env.VITE_API_URL || '';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [usernameError, setUsernameError] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Mark that user has visited the site
  useEffect(() => {
    localStorage.setItem('hasVisited', 'true');
  }, []);

  // Debounced username check
  useEffect(() => {
    const checkUsername = async () => {
      if (!username || username.length < 3) {
        setUsernameAvailable(null);
        setUsernameError('');
        return;
      }

      setUsernameChecking(true);
      setUsernameError('');

      try {
        const response = await fetch(`${API_URL}/api/auth/check-username/${encodeURIComponent(username)}`);
        const data = await response.json();

        if (data.available) {
          setUsernameAvailable(true);
        } else {
          setUsernameAvailable(false);
          setUsernameError('Username is already taken');
        }
      } catch (error) {
        console.error('Username check error:', error);
        // Don't show error to user, just reset state
        setUsernameAvailable(null);
      } finally {
        setUsernameChecking(false);
      }
    };

    // Debounce the check by 500ms
    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate username
    if (username.trim().length === 0) {
      setError('Username is required');
      setLoading(false);
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }

    if (!usernameAvailable) {
      setError('Please choose an available username');
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Validate password requirements
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }
    
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter');
      setLoading(false);
      return;
    }
    
    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter');
      setLoading(false);
      return;
    }
    
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number');
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, username);

    if (error) {
      // Parse Supabase error messages for user-friendly display
      let errorMessage = error.message;
      
      if (errorMessage.includes('User already registered')) {
        errorMessage = 'A user with this email address already exists. Please login instead.';
      } else if (errorMessage.includes('Username is already taken')) {
        errorMessage = 'This username is already taken. Please choose another username.';
      } else if (errorMessage.includes('Email address') || errorMessage.includes('email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (errorMessage.includes('Password') || errorMessage.includes('password')) {
        errorMessage = 'Password does not meet requirements. Please ensure it has at least 8 characters, 1 uppercase letter, 1 lowercase letter, and 1 number.';
      } else if (errorMessage.includes('signup') || errorMessage.includes('Signups')) {
        errorMessage = 'Account creation is currently unavailable. Please try again later.';
      } else if (errorMessage.includes('Network')) {
        errorMessage = 'Unable to connect. Please check your internet connection and try again.';
      } else if (errorMessage.includes('rate limit') || errorMessage.includes('too many')) {
        errorMessage = 'Too many registration attempts. Please wait a few minutes and try again.';
      }
      
      setError(errorMessage);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Sword className="w-16 h-16 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">RPG Todo</h1>
          <p className="text-emerald-200">Begin your quest</p>
        </div>

        {/* Register Form */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Create Account
          </h2>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  className={`w-full px-4 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white ${
                    usernameError 
                      ? 'border-red-500 dark:border-red-500' 
                      : usernameAvailable 
                      ? 'border-green-500 dark:border-green-500' 
                      : 'border-gray-300 dark:border-gray-700'
                  }`}
                  placeholder="hero123"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {usernameChecking && (
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  )}
                  {!usernameChecking && usernameAvailable === true && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  {!usernameChecking && usernameAvailable === false && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
              {usernameError && (
                <p className="mt-1 text-xs text-red-500">{usernameError}</p>
              )}
              {usernameAvailable && !usernameError && (
                <p className="mt-1 text-xs text-green-600 dark:text-green-400">Username is available!</p>
              )}
              {username.length > 0 && username.length < 3 && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Username must be at least 3 characters</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Must be at least 8 characters, include 1 uppercase letter, 1 lowercase letter, and 1 number
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

