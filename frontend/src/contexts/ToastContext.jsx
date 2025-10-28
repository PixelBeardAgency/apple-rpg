// Toast Context
// Manages toast notifications for achievements and other events

import { createContext, useContext, useState, useCallback } from 'react';
import { Trophy, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 5000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  }, []);

  const showAchievementToast = useCallback((achievementName, bonusXP) => {
    const id = Date.now();
    setToasts(prev => [...prev, { 
      id, 
      type: 'achievement', 
      achievementName, 
      bonusXP 
    }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 6000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, showAchievementToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-20 right-4 z-50 space-y-2 max-w-md">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ toast, onDismiss }) => {
  if (toast.type === 'achievement') {
    return (
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg shadow-2xl p-4 animate-slide-in-right flex items-start space-x-3 border-2 border-yellow-300">
        <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <Trophy className="w-6 h-6 text-yellow-600" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-lg mb-1">Achievement Unlocked!</div>
          <div className="text-yellow-100 text-sm mb-1">{toast.achievementName}</div>
          <div className="text-xs font-semibold bg-white/20 inline-block px-2 py-0.5 rounded">
            +{toast.bonusXP} Bonus XP
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-white hover:text-yellow-200 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[toast.type] || 'bg-gray-800';

  return (
    <div className={`${bgColor} text-white rounded-lg shadow-lg p-4 animate-slide-in-right flex items-center justify-between`}>
      <div>{toast.message}</div>
      <button
        onClick={onDismiss}
        className="ml-4 text-white hover:text-gray-200 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

