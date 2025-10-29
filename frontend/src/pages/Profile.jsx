// Profile Page
// User profile with progress bar, achievements, and editable info

import { useState } from 'react';
import { useProfile, useUpdateProfile } from '../hooks/useProfile';
import { supabase } from '../lib/supabase';
import { User, Edit2, Trophy, Zap, Lock } from 'lucide-react';
import ProfilePictureUpload from '../components/profile/ProfilePictureUpload';

const Profile = () => {
  const { data: profile, isLoading, refetch } = useProfile();
  const updateProfile = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    bio: ''
  });

  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleProfilePictureUpload = () => {
    // Refetch profile to update picture everywhere
    refetch();
  };

  const handleEdit = () => {
    setEditData({
      username: profile?.username || '',
      bio: profile?.bio || ''
    });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile.mutateAsync(editData);
    setIsEditing(false);
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validate new password
    const passwordValidationError = validatePassword(passwordData.newPassword);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    // Check passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      // First verify current password by attempting to sign in
      const { data: { user } } = await supabase.auth.getUser();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordData.currentPassword
      });

      if (signInError) {
        setPasswordError('Current password is incorrect');
        return;
      }

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (updateError) throw updateError;

      setPasswordSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setPasswordSuccess('');
        setIsChangingPassword(false);
      }, 3000);
    } catch (error) {
      setPasswordError(error.message || 'Failed to change password');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-6 border border-gray-200 dark:border-gray-800">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
              {profile?.profile_picture_url ? (
                <img
                  src={profile.profile_picture_url}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {profile?.username || 'Hero'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {profile?.email}
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-md transition"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* Profile Picture Upload Section */}
        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <ProfilePictureUpload
            currentPictureUrl={profile?.profile_picture_url}
            onUploadComplete={handleProfilePictureUpload}
          />
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                value={editData.username}
                onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={updateProfile.isPending}
                className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50"
              >
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-md transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            {profile?.bio ? (
              <p className="text-gray-700 dark:text-gray-300">{profile.bio}</p>
            ) : (
              <p className="text-gray-500 dark:text-gray-500 italic">No bio yet. Click Edit Profile to add one!</p>
            )}
          </div>
        )}
      </div>

      {/* Level & XP Progress (CRITICAL: Must be in profile) */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-6 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Level {profile?.progress?.currentLevel || 1}
          </h2>
        </div>

        {profile?.progress?.isMaxLevel ? (
          <div className="text-center py-6">
            <p className="text-2xl font-bold text-purple-600 mb-2">🎉 MAX LEVEL REACHED! 🎉</p>
            <p className="text-gray-600 dark:text-gray-400">
              You've mastered the art of productivity!
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">
                {profile?.progress?.xpProgress || 0} / {profile?.progress?.xpNeeded || 0} XP
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {profile?.progress?.progressPercentage || 0}% to Level {(profile?.progress?.currentLevel || 1) + 1}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 h-full transition-all duration-500 ease-out flex items-center justify-center text-white text-xs font-bold"
                style={{ width: `${profile?.progress?.progressPercentage || 0}%` }}
              >
                {profile?.progress?.progressPercentage > 10 && `${profile?.progress?.progressPercentage}%`}
              </div>
            </div>
          </>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Total XP</div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {profile?.total_xp || 0}
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Current Level</div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {profile?.current_level || 1}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Summary */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-800 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h2>
        </div>

        <div className="text-center py-8">
          <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">
            {profile?.achievements?.earned || 0}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            out of {profile?.achievements?.total || 10} achievements earned
          </p>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full transition-all duration-500"
                style={{
                  width: `${((profile?.achievements?.earned || 0) / (profile?.achievements?.total || 10)) * 100}%`
                }}
              />
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-500 italic">
          Complete tasks and reach milestones to unlock achievements!
        </p>
      </div>

      {/* Password Change Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3 mb-4">
          <Lock className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Change Password</h2>
        </div>

        {!isChangingPassword ? (
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Keep your account secure by updating your password regularly.
            </p>
            <button
              onClick={() => setIsChangingPassword(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Change Password
            </button>
          </div>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {passwordError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-md">
                {passwordSuccess}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength={8}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Enter new password"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Must be at least 8 characters, include 1 uppercase letter, 1 lowercase letter, and 1 number
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                minLength={8}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
              >
                Update Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordError('');
                  setPasswordSuccess('');
                }}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-md transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;

