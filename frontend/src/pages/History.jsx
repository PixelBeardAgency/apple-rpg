// History Page
// Displays completed tasks with stats and timeline

import { useTasks } from '../hooks/useTasks';
import { Check, Calendar, Trophy, TrendingUp } from 'lucide-react';
import { getPriorityColor, formatDateTime } from '../lib/utils';

const History = () => {
  const { data: tasks } = useTasks();

  const completedTasks = tasks?.filter((task) => task.is_completed) || [];
  const totalXPEarned = completedTasks.reduce((sum, task) => sum + (task.xp_earned || 0), 0);

  // Group by completion date
  const tasksByDate = completedTasks.reduce((groups, task) => {
    const date = new Date(task.completed_at).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {});

  const dateGroups = Object.entries(tasksByDate).sort(
    ([dateA], [dateB]) => new Date(dateB) - new Date(dateA)
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Trophy className="w-8 h-8 text-green-600 dark:text-green-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Task History</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Review your completed tasks and track your progress over time.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {completedTasks.length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">XP Earned</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalXPEarned}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Days Active</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {Object.keys(tasksByDate).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {completedTasks.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-12 text-center border border-gray-200 dark:border-gray-800">
          <div className="text-6xl mb-4">📜</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No Completed Tasks Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Complete your first task to start building your history!
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {dateGroups.map(([date, tasksForDate]) => (
            <div key={date}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{date}</h2>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
              </div>

              <div className="space-y-3 ml-5 pl-5 border-l-2 border-gray-200 dark:border-gray-800">
                {tasksForDate.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Check className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0" />
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {task.title}
                          </h3>
                        </div>

                        {task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 ml-8">
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 ml-8 text-xs">
                          <span className={`px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="text-gray-500 dark:text-gray-500">
                            Completed {formatDateTime(task.completed_at)}
                          </span>
                          {task.labels && task.labels.length > 0 && (
                            <div className="flex gap-1">
                              {task.labels.map((label) => (
                                <span
                                  key={label.id}
                                  className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                  {label.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            +{task.xp_earned} XP
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;

