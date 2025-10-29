// Label Manager Component
// Create, edit, and delete custom labels

import { useState } from 'react';
import { useLabels, useCreateLabel, useUpdateLabel, useDeleteLabel } from '../../hooks/useLabels';
import { useToast } from '../../contexts/ToastContext';
import ConfirmModal from '../ui/ConfirmModal';
import { Tag, Plus, Edit2, Trash2, X, Check } from 'lucide-react';

const LabelManager = () => {
  const { data: labels, isLoading } = useLabels();
  const createLabel = useCreateLabel();
  const updateLabel = useUpdateLabel();
  const deleteLabel = useDeleteLabel();
  const { showAchievementToast } = useToast();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [labelName, setLabelName] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [labelToDelete, setLabelToDelete] = useState(null);

  const customLabels = labels?.filter(label => !label.is_default) || [];
  const defaultLabels = labels?.filter(label => label.is_default) || [];

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!labelName.trim()) return;

    const result = await createLabel.mutateAsync({ name: labelName.trim() });
    
    // Show achievement toasts if any were unlocked
    if (result.achievements && result.achievements.length > 0) {
      result.achievements.forEach((achievement) => {
        showAchievementToast(achievement.name, achievement.bonus_xp);
      });
    }
    
    setLabelName('');
    setIsCreating(false);
  };

  const handleUpdate = async (id) => {
    if (!labelName.trim()) return;

    await updateLabel.mutateAsync({ id, name: labelName.trim() });
    setLabelName('');
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    setLabelToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (labelToDelete) {
      await deleteLabel.mutateAsync(labelToDelete);
      setLabelToDelete(null);
    }
  };

  const startEditing = (label) => {
    setEditingId(label.id);
    setLabelName(label.name);
    setIsCreating(false);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setLabelName('');
  };

  if (isLoading) {
    return <div className="text-gray-600 dark:text-gray-400">Loading labels...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Tag className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Manage Labels</h3>
        </div>
        {!isCreating && (
          <button
            onClick={() => {
              setIsCreating(true);
              setEditingId(null);
              setLabelName('');
            }}
            className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Label</span>
          </button>
        )}
      </div>

      {/* Create New Label Form */}
      {isCreating && (
        <form onSubmit={handleCreate} className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
              placeholder="Label name..."
              autoFocus
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              disabled={!labelName.trim() || createLabel.isPending}
              className="p-1.5 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 transition"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setLabelName('');
              }}
              className="p-1.5 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Default Labels */}
      {defaultLabels.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase mb-2">
            Default Labels
          </div>
          <div className="space-y-2">
            {defaultLabels.map((label) => (
              <div
                key={label.id}
                className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-400 mr-2">System</span>
                  <button
                    onClick={() => handleDelete(label.id)}
                    className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition"
                    title="Delete label"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Labels */}
      <div>
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase mb-2">
          Custom Labels {customLabels.length > 0 && `(${customLabels.length})`}
        </div>
        {customLabels.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-500 italic py-4 text-center">
            No custom labels yet. Create one to get started!
          </div>
        ) : (
          <div className="space-y-2">
            {customLabels.map((label) => (
              <div
                key={label.id}
                className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                {editingId === label.id ? (
                  <div className="flex items-center space-x-2 flex-1">
                    <input
                      type="text"
                      value={labelName}
                      onChange={(e) => setLabelName(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdate(label.id)}
                      disabled={!labelName.trim() || updateLabel.isPending}
                      className="p-1 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 transition"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="p-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-primary" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{label.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => startEditing(label)}
                        className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(label.id)}
                        className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setLabelToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Label"
        message="Are you sure you want to delete this label? It will be removed from all tasks."
        confirmText="Delete"
        confirmColor="red"
      />
    </div>
  );
};

export default LabelManager;

