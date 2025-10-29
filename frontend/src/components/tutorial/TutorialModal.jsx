// Tutorial Modal Component
// Interactive first-login onboarding flow

import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Zap, Trophy, Tag, Filter } from 'lucide-react';

const TutorialModal = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to RPG Todo!',
      icon: Trophy,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Turn your productivity into an adventure! RPG Todo gamifies your task management with an XP system, levels, and achievements.
          </p>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">How XP Works</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• <strong>High</strong> priority tasks: <span className="text-green-600 dark:text-green-500 font-bold">+100 XP</span></li>
                  <li>• <strong>Medium</strong> priority tasks: <span className="text-blue-600 dark:text-blue-500 font-bold">+50 XP</span></li>
                  <li>• <strong>Low</strong> priority tasks: <span className="text-purple-600 dark:text-purple-500 font-bold">+25 XP</span></li>
                  <li>• <strong>Achievements</strong>: <span className="text-amber-600 dark:text-amber-500 font-bold">Bonus XP</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Create Your First Task',
      icon: Check,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Tasks are the heart of RPG Todo. Click the <strong>"Create Task"</strong> button on your dashboard to add a new task.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Task Fields:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li><strong>Title:</strong> What needs to be done</li>
              <li><strong>Description:</strong> Additional details (optional)</li>
              <li><strong>Priority:</strong> HIGH, MEDIUM, or LOW (affects XP)</li>
              <li><strong>Due Date:</strong> When it's due (optional)</li>
              <li><strong>Labels:</strong> Organise your tasks (optional)</li>
            </ul>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500 italic">
            💡 Tip: Start with a High priority task to earn 100 XP!
          </p>
        </div>
      )
    },
    {
      title: 'Complete Tasks & Earn XP',
      icon: Zap,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            When you finish a task, click the green checkmark button. You'll earn XP based on the task's priority!
          </p>
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">What Happens:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li>✅ Task marked as complete</li>
              <li>🎯 XP added to your total</li>
              <li>📈 Progress bar updates</li>
              <li>⬆️ Level up when you reach required XP</li>
              <li>🏆 Unlock achievements for milestones</li>
            </ul>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500 italic">
            💡 Tip: Check the Achievements page to see what you can unlock!
          </p>
        </div>
      )
    },
    {
      title: 'Custom Labels',
      icon: Tag,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Use labels to organise your tasks by category. You have 4 default labels, but you can create unlimited custom labels!
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Default Labels:</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                Work
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                Personal
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                Urgent
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                Goals
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click the <strong>"New Label"</strong> button in the Label Manager section to create your own!
            </p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500 italic">
            💡 Tip: Create 3 custom labels to unlock an achievement!
          </p>
        </div>
      )
    },
    {
      title: 'Filter & Organise',
      icon: Filter,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Use label filters to focus on specific categories of tasks. Click any label in the filter section to show only tasks with that label.
          </p>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Smart Features:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li>📅 <strong>Task Sorting:</strong> Today's tasks appear first</li>
              <li>✏️ <strong>Edit Tasks:</strong> Click the edit button to modify</li>
              <li>📊 <strong>XP Guide:</strong> Click ? next to "Current Level"</li>
              <li>🎨 <strong>Dark Mode:</strong> Toggle in the header</li>
              <li>📜 <strong>History:</strong> View all completed tasks</li>
            </ul>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 text-white">
            <h4 className="font-bold mb-1">You're All Set!</h4>
            <p className="text-sm text-green-50">
              Start creating tasks, earn XP, and level up your productivity! 🚀
            </p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('tutorial_completed', 'true');
    if (onComplete) onComplete();
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('tutorial_completed', 'true');
    onClose();
  };

  if (!isOpen) return null;

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full animate-scale-in border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-green-500 to-emerald-600">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <CurrentIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {steps[currentStep].title}
              </h2>
              <p className="text-green-100 text-sm">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="text-white/80 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[300px]">
          {steps[currentStep].content}
        </div>

        {/* Progress Indicators */}
        <div className="px-6 pb-4">
          <div className="flex justify-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-primary'
                    : index < currentStep
                    ? 'w-2 bg-green-500'
                    : 'w-2 bg-gray-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
          <button
            onClick={handleSkip}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition font-medium"
          >
            Skip Tutorial
          </button>
          
          <div className="flex space-x-3">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            )}
            
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition font-medium"
            >
              <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
              {currentStep === steps.length - 1 ? (
                <Check className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;

