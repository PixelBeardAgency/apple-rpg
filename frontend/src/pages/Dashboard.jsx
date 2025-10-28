// Dashboard Page
// Main task list view with create task functionality

import { useState, useEffect } from 'react';
import { useTasks, useCreateTask, useCompleteTask, useDeleteTask } from '../hooks/useTasks';
import { useProfile } from '../hooks/useProfile';
import { useLabels } from '../hooks/useLabels';
import { useAchievements } from '../hooks/useAchievements';
import { useToast } from '../contexts/ToastContext';
import Tooltip from '../components/ui/Tooltip';
import { Plus, Check, Trash2, Calendar, X, Tag } from 'lucide-react';
import { getPriorityColor, getXPForPriority, formatDate } from '../lib/utils';

const Dashboard = () => {
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: profile } = useProfile();
  const { data: labels } = useLabels();
  const { data: achievements, refetch: refetchAchievements } = useAchievements();
  const { showAchievementToast } = useToast();
  const createTask = useCreateTask();
  const completeTask = useCompleteTask();
  const deleteTask = useDeleteTask();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [filterLabels, setFilterLabels] = useState([]);
  const [previousAchievements, setPreviousAchievements] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    due_date: ''
  });

  // Track achievement changes and show toasts
  useEffect(() => {
    if (achievements && previousAchievements) {
      const newlyEarned = achievements.filter(
        (achievement) =>
          achievement.earned &&
          !previousAchievements.find((prev) => prev.id === achievement.id && prev.earned)
      );

      newlyEarned.forEach((achievement) => {
        showAchievementToast(achievement.name, achievement.bonus_xp);
      });
    }

    if (achievements) {
      setPreviousAchievements(achievements);
    }
  }, [achievements, previousAchievements, showAchievementToast]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    // Convert empty strings to null for optional fields
    const taskData = {
      ...newTask,
      description: newTask.description || null,
      due_date: newTask.due_date || null,
      label_ids: selectedLabels
    };
    await createTask.mutateAsync(taskData);
    setNewTask({ title: '', description: '', priority: 'MEDIUM', due_date: '' });
    setSelectedLabels([]);
    setShowCreateForm(false);
  };

  const handleCompleteTask = async (taskId) => {
    await completeTask.mutateAsync(taskId);
    // Refetch achievements to check for newly unlocked ones
    setTimeout(() => refetchAchievements(), 500);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask.mutateAsync(taskId);
    }
  };

  // Sort tasks by priority and completion status
  const sortedTasks = tasks?.sort((a, b) => {
    if (a.is_completed !== b.is_completed) {
      return a.is_completed ? 1 : -1;
    }
    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Filter tasks by selected labels
  const filteredTasks = sortedTasks?.filter(task => {
    if (filterLabels.length === 0) return true;
    return task.labels?.some(label => filterLabels.includes(label.id));
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome, {profile?.username || 'Hero'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Complete tasks to earn XP and level up
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Level</div>
          <div className="text-3xl font-bold text-primary">{profile?.current_level || 1}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total XP</div>
          <div className="text-3xl font-bold text-purple-600">{profile?.total_xp || 0}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Achievements</div>
          <div className="text-3xl font-bold text-green-600">
            {profile?.achievements?.earned || 0} / {profile?.achievements?.total || 10}
          </div>
        </div>
      </div>

      {/* Create Task Button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          <Plus className="w-5 h-5" />
          <span>Create Task</span>
        </button>

        {/* Label Filter */}
        {labels && labels.length > 0 && (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">Filter by label:</span>
            <div className="flex flex-wrap gap-2">
              {labels.map((label) => (
                <button
                  key={label.id}
                  onClick={() => {
                    setFilterLabels(prev =>
                      prev.includes(label.id)
                        ? prev.filter(id => id !== label.id)
                        : [...prev, label.id]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    filterLabels.includes(label.id)
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {label.name}
                </button>
              ))}
              {filterLabels.length > 0 && (
                <button
                  onClick={() => setFilterLabels([])}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 transition"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Task Form */}
      {showCreateForm && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">New Task</h3>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="What needs to be done?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Additional details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span className="inline-flex items-center space-x-2">
                    <span>Priority *</span>
                    <Tooltip content="Higher priority tasks earn more XP!" />
                  </span>
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                >
                  <option value="HIGH">High (+100 XP)</option>
                  <option value="MEDIUM">Medium (+50 XP)</option>
                  <option value="LOW">Low (+25 XP)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span className="inline-flex items-center space-x-2">
                    <span>Due Date</span>
                    <Tooltip content="Set a deadline to stay organised!" />
                  </span>
                </label>
                <input
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {/* Label Selection */}
            {labels && labels.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <span className="inline-flex items-center space-x-2">
                    <span>Labels (optional)</span>
                    <Tooltip content="Organise tasks with custom labels!" />
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {labels.map((label) => (
                    <button
                      key={label.id}
                      type="button"
                      onClick={() => {
                        setSelectedLabels(prev =>
                          prev.includes(label.id)
                            ? prev.filter(id => id !== label.id)
                            : [...prev, label.id]
                        );
                      }}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                        selectedLabels.includes(label.id)
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>{label.name}</span>
                      {selectedLabels.includes(label.id) && (
                        <X className="w-3.5 h-3.5" />
                      )}
                    </button>
                  ))}
                </div>
                {selectedLabels.length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {selectedLabels.length} label{selectedLabels.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={createTask.isPending}
                className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50"
              >
                {createTask.isPending ? 'Creating...' : 'Create Task'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-md transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Task List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Tasks</h2>
        
        {tasksLoading ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading tasks...</div>
        ) : filteredTasks?.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-8 text-center border border-gray-200 dark:border-gray-800">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {filterLabels.length > 0 ? 'No tasks match the selected labels.' : 'No tasks yet. Create one to get started!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks?.map((task) => (
              <div
                key={task.id}
                className={`bg-white dark:bg-gray-900 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-800 transition ${
                  task.is_completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`text-lg font-semibold ${
                        task.is_completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'
                      }`}>
                        {task.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority} (+{getXPForPriority(task.priority)} XP)
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{task.description}</p>
                    )}
                    
                    {task.labels && task.labels.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {task.labels.map((label) => (
                          <span
                            key={label.id}
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          >
                            <Tag className="w-3 h-3" />
                            <span>{label.name}</span>
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {task.due_date && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        Due: {formatDate(task.due_date)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {!task.is_completed && (
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        disabled={completeTask.isPending}
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md transition disabled:opacity-50"
                        title="Complete Task"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      disabled={deleteTask.isPending}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition disabled:opacity-50"
                      title="Delete Task"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

