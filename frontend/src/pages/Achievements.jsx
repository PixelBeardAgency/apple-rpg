// Achievements Page
// Displays all 10 achievements with locked/unlocked state

import { useAchievements } from '../hooks/useAchievements';
import { Trophy, Lock, Check, Zap } from 'lucide-react';
import { formatDateTime } from '../lib/utils';

const Achievements = () => {
  const { data: achievements, isLoading } = useAchievements();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading achievements...</div>
      </div>
    );
  }

  const earnedCount = achievements?.filter(a => a.earned).length || 0;
  const totalCount = achievements?.length || 10;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Achievements
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Unlock achievements to earn bonus XP and show off your accomplishments!
        </p>
      </div>

      {/* Progress Summary */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Your Progress
            </div>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              {earnedCount} / {totalCount}
            </div>
          </div>
          <div className="text-6xl">
            {earnedCount === totalCount ? '🏆' : '🎯'}
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full transition-all duration-500"
            style={{ width: `${(earnedCount / totalCount) * 100}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-right">
          {Math.floor((earnedCount / totalCount) * 100)}% Complete
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements?.map((achievement) => (
          <div
            key={achievement.id}
            className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 border-2 transition-all ${
              achievement.earned
                ? 'border-yellow-400 dark:border-yellow-600'
                : 'border-gray-200 dark:border-gray-800 opacity-75'
            }`}
          >
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div
                className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                  achievement.earned
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                {achievement.earned ? (
                  <Check className="w-8 h-8 text-white" />
                ) : (
                  <Lock className="w-8 h-8 text-gray-500" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {achievement.name}
                  </h3>
                  {achievement.earned && (
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {achievement.description}
                </p>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-primary">
                    <Zap className="w-4 h-4" />
                    <span className="font-semibold">+{achievement.bonus_xp} XP</span>
                  </div>
                  
                  {achievement.earned && achievement.earned_at && (
                    <div className="text-gray-500 dark:text-gray-500 text-xs">
                      Unlocked {formatDateTime(achievement.earned_at)}
                    </div>
                  )}
                </div>

                {!achievement.earned && achievement.progress && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                      <span className="font-semibold">Progress</span>
                      <span className="font-mono">
                        {achievement.progress.current} / {achievement.progress.required}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary to-emerald-600 h-full transition-all duration-300"
                        style={{ width: `${achievement.progress.percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {earnedCount === totalCount && (
        <div className="mt-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-lg p-6 text-center text-white">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Achievement Master!</h2>
          <p>You've unlocked all achievements! You're a true productivity champion!</p>
        </div>
      )}
    </div>
  );
};

export default Achievements;

