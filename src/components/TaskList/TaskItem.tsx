import React, { useState } from 'react';
import type { Task } from '../../types/task';
import { useTaskContext } from '../../context/TaskContext';
import { TaskForm } from '../TaskForm/TaskForm';
import { 
  FaCheckCircle, 
  FaCircle, 
  FaEdit, 
  FaTrash, 
  FaFlag,
  FaBriefcase,
  FaUser,
  FaBook,
  FaEllipsisH,
  FaClock
} from 'react-icons/fa';

interface TaskItemProps {
  task: Task;
}

const priorityStyles = {
  high: {
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-500',
  },
  medium: {
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'text-amber-500',
  },
  low: {
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'text-emerald-500',
  },
};

const categoryIcons = {
  work: <FaBriefcase />,
  personal: <FaUser />,
  study: <FaBook />,
  other: <FaEllipsisH />,
};

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTask, deleteTask } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggle = () => {
    toggleTask(task.id);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setShowDeleteConfirm(false);
  };

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  if (isEditing) {
    return (
      <TaskForm
        taskToEdit={task}
        onClose={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className={`glass-card rounded-xl p-5 mb-4 transition-all duration-300 hover:scale-[1.02] ${
      task.completed ? 'opacity-70 hover:opacity-90' : ''
    } animate-slide-up`}>
      <div className="flex items-start gap-4">
        {/* チェックボックス */}
        <button
          onClick={handleToggle}
          className={`text-2xl transition-all duration-200 ${
            task.completed 
              ? 'text-emerald-500 hover:text-emerald-600' 
              : 'text-slate-300 hover:text-emerald-400 hover:scale-110'
          }`}
        >
          {task.completed ? <FaCheckCircle /> : <FaCircle />}
        </button>

        {/* メインコンテンツ */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`text-gray-600 mt-1 ${task.completed ? 'line-through' : ''}`}>
                  {task.description}
                </p>
              )}

              {/* メタ情報 */}
              <div className="flex items-center gap-4 mt-2 text-sm">
                {/* カテゴリー */}
                <div className="flex items-center gap-1 text-gray-500">
                  {categoryIcons[task.category]}
                  <span className="capitalize">{task.category}</span>
                </div>

                {/* 優先度 */}
                <div className={`badge ${priorityStyles[task.priority].bg} ${priorityStyles[task.priority].border} border ${priorityStyles[task.priority].color}`}>
                  <FaFlag className={`${priorityStyles[task.priority].icon} text-xs`} />
                  <span className="font-medium">
                    {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                  </span>
                </div>

                {/* 期限 */}
                {task.dueDate && (
                  <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
                    <FaClock />
                    <span>
                      {new Date(task.dueDate).toLocaleDateString('ja-JP')}
                      {isOverdue && ' (期限切れ)'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all duration-200"
                title="編集"
              >
                <FaEdit className="text-lg" />
              </button>
              
              {showDeleteConfirm ? (
                <div className="flex items-center gap-2 ml-2 animate-slide-up">
                  <button
                    onClick={handleDelete}
                    className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                  >
                    削除する
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-xs bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="削除"
                >
                  <FaTrash className="text-lg" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};