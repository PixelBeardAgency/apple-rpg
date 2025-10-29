// Header Component with Progress Bar
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useProfile } from '../../hooks/useProfile';
import { User, LogOut, Moon, Sun } from 'lucide-react';
import { SwordPixelIcon, HomeIcon, TrophyIcon, ScrollIcon, UserPixelIcon } from '../icons/PixelIcons';

const Header = () => {
  const { signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { data: profile } = useProfile();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <SwordPixelIcon className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-primary">RPG Todo</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition"
            >
              Dashboard
            </Link>
            <Link
              to="/achievements"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition"
            >
              Achievements
            </Link>
            <Link
              to="/history"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition"
            >
              History
            </Link>
            <Link
              to="/profile"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition"
            >
              Profile
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            <Link
              to="/profile"
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary transition"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                {profile?.profile_picture_url ? (
                  <img
                    src={profile.profile_picture_url}
                    alt={profile.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <span className="hidden sm:inline">{profile?.username || 'Profile'}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-red-600 transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar (CRITICAL: Must be in header) */}
        {profile && (
          <div className="pb-4" key={`progress-${profile.progress.progressPercentage}`}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">
                Level {profile.progress.currentLevel}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {profile.progress.isMaxLevel ? (
                  'Max Level!'
                ) : (
                  `${profile.progress.xpProgress} / ${profile.progress.xpNeeded} XP (${profile.progress.totalXP} lifetime XP)`
                )}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                key={profile.progress.progressPercentage}
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-full transition-all duration-500 ease-out"
                style={{ width: `${profile.progress.progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

