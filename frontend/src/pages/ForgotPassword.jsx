// Forgot Password Page
// Allows users to request a password reset email
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Sword, Mail } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (error) {
      setError(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Sword className="w-16 h-16 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">RPG Todo</h1>
          <p className="text-blue-200">Reset your password</p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Forgot Password
          </h2>

          {success ? (
            <div className="text-center py-6">
              <div className="flex justify-center mb-4">
                <Mail className="w-16 h-16 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Check Your Email
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We've sent a password reset link to <strong>{email}</strong>. 
                Please check your inbox and follow the instructions to reset your password.
              </p>
              <Link
                to="/login"
                className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-md transition"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
                  ← Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

