import React, { useState } from 'react';
import { Task } from '../../types/task';
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

const priorityColors = {
  high: 'text-red-500',
  medium: 'text-yellow-500',
  low: 'text-green-500',
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
    <div className={`bg-white rounded-lg shadow-md p-4 mb-3 transition-all ${task.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start gap-3">
        {/* チェックボックス */}
        <button
          onClick={handleToggle}
          className={`text-2xl transition-colors ${
            task.completed ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
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
                <div className={`flex items-center gap-1 ${priorityColors[task.priority]}`}>
                  <FaFlag />
                  <span className="capitalize">{task.priority}</span>
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:text-blue-700 transition-colors"
                title="編集"
              >
                <FaEdit />
              </button>
              
              {showDeleteConfirm ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleDelete}
                    className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    削除
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400 transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="削除"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};