import React, { useState } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import type { Priority, Category, Task } from '../../types/task';
import { FaPlus, FaTimes } from 'react-icons/fa';

interface TaskFormProps {
  taskToEdit?: Task;
  onClose?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ taskToEdit, onClose }) => {
  const { addTask, updateTask } = useTaskContext();
  const [isOpen, setIsOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: taskToEdit?.title || '',
    description: taskToEdit?.description || '',
    priority: taskToEdit?.priority || 'medium' as Priority,
    category: taskToEdit?.category || 'personal' as Category,
    dueDate: taskToEdit?.dueDate ? taskToEdit.dueDate.toISOString().split('T')[0] : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      category: formData.category,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      completed: taskToEdit?.completed || false,
    };

    if (taskToEdit) {
      updateTask({ ...taskToEdit, ...taskData });
      onClose?.();
    } else {
      addTask(taskData);
      // フォームをリセット
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: 'personal',
        dueDate: '',
      });
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    if (taskToEdit && onClose) {
      onClose();
    } else {
      setIsOpen(false);
      // フォームをリセット
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: 'personal',
        dueDate: '',
      });
    }
  };

  if (!taskToEdit && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn-primary flex items-center gap-2 w-full md:w-auto justify-center animate-fade-in"
      >
        <FaPlus className="text-lg" /> 
        <span className="font-semibold">新しいタスクを追加</span>
      </button>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6 mb-6 animate-slide-up">
      <h2 className="text-xl font-semibold mb-4">
        {taskToEdit ? 'タスクを編集' : '新しいタスクを作成'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input-field"
            placeholder="タスクのタイトルを入力"
            required
            aria-label="タイトル"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
            説明
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-field"
            placeholder="詳細な説明（任意）"
            rows={3}
            aria-label="説明"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-2">
              優先度
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
              className="input-field"
            >
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
              カテゴリー
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
              className="input-field"
            >
              <option value="work">仕事</option>
              <option value="personal">個人</option>
              <option value="study">学習</option>
              <option value="other">その他</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700 mb-2">
            期限
          </label>
          <input
            type="date"
            id="dueDate"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="input-field"
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-secondary flex items-center gap-2"
          >
            <FaTimes /> キャンセル
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
          >
            {taskToEdit ? 'タスクを更新' : 'タスクを追加'}
          </button>
        </div>
      </form>
    </div>
  );
};