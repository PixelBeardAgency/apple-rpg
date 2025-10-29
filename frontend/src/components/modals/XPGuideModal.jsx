// XP Guide Modal Component
// Shows all levels with XP requirements and highlights current level

import { X, Trophy, TrendingUp } from 'lucide-react';
import { useLevels } from '../../hooks/useLevels';
import { useProfile } from '../../hooks/useProfile';

const XPGuideModal = ({ isOpen, onClose }) => {
  const { data: levels } = useLevels();
  const { data: profile } = useProfile();

  if (!isOpen) return null;

  const currentLevel = profile?.current_level || 0;
  const totalXP = profile?.total_xp || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-scale-in border border-gray-200 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-green-500 to-emerald-600">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                XP & Levels Guide
              </h2>
              <p className="text-green-100 text-sm">
                Your progression roadmap
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Current Status */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Your Current Level</div>
              <div className="text-3xl font-bold text-primary">Level {currentLevel}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 text-right">Total XP Earned</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalXP.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Levels Table */}
        <div className="overflow-y-auto max-h-[400px]">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  XP Required
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {levels?.map((level) => {
                const isCurrentLevel = level.level_number === currentLevel;
                const isUnlocked = totalXP >= level.xp_required;
                const isNextLevel = level.level_number === currentLevel + 1;

                return (
                  <tr
                    key={level.level_number}
                    className={`
                      ${isCurrentLevel ? 'bg-green-50 dark:bg-green-900/10' : ''}
                      ${isNextLevel && !isCurrentLevel ? 'bg-blue-50 dark:bg-blue-900/10' : ''}
                      hover:bg-gray-50 dark:hover:bg-gray-800/50 transition
                    `}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {isUnlocked ? (
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                            <Trophy className="w-3.5 h-3.5 text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-600" />
                          </div>
                        )}
                        <div>
                          <div className={`font-semibold ${
                            isCurrentLevel 
                              ? 'text-green-600 dark:text-green-500' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            Level {level.level_number}
                            {level.level_number === 0 && ' (Starting)'}
                            {level.level_number === 20 && ' (Max)'}
                          </div>
                          {isCurrentLevel && (
                            <div className="text-xs text-green-600 dark:text-green-500 font-medium">
                              ← You are here
                            </div>
                          )}
                          {isNextLevel && !isCurrentLevel && (
                            <div className="text-xs text-blue-600 dark:text-blue-500 font-medium">
                              Next level
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="font-mono font-semibold text-gray-900 dark:text-white">
                        {level.xp_required.toLocaleString()} XP
                      </div>
                      {level.level_number > 0 && levels[level.level_number - 1] && (
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          +{(level.xp_required - levels[level.level_number - 1].xp_required).toLocaleString()} from prev
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {isUnlocked ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-500">
                          Unlocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          Locked
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-start space-x-4">
            <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">How to earn XP:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li><strong>High</strong> priority tasks: <span className="text-green-600 dark:text-green-500 font-bold">+100 XP</span></li>
                <li><strong>Medium</strong> priority tasks: <span className="text-blue-600 dark:text-blue-500 font-bold">+50 XP</span></li>
                <li><strong>Low</strong> priority tasks: <span className="text-purple-600 dark:text-purple-500 font-bold">+25 XP</span></li>
                <li><strong>Achievements</strong>: <span className="text-amber-600 dark:text-amber-500 font-bold">Bonus XP</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XPGuideModal;

