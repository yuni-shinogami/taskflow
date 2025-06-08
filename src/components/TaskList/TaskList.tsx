import React from 'react';
import { TaskItem } from './TaskItem';
import { useTasks } from '../../hooks/useTasks';
import { FaInbox } from 'react-icons/fa';

export const TaskList: React.FC = () => {
  const { tasks } = useTasks();

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <FaInbox className="text-6xl text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">タスクがありません</p>
        <p className="text-gray-400 mt-2">新しいタスクを追加してください</p>
      </div>
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};