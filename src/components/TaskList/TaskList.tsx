import React from 'react';
import { TaskItem } from './TaskItem';
import { useTasks } from '../../hooks/useTasks';
import { FaInbox } from 'react-icons/fa';

export const TaskList: React.FC = () => {
  const { tasks } = useTasks();

  if (tasks.length === 0) {
    return (
      <div className="glass-card rounded-xl p-12 text-center animate-fade-in">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaInbox className="text-5xl text-primary-400" />
        </div>
        <p className="text-slate-700 text-xl font-medium mb-2">タスクがありません</p>
        <p className="text-slate-500">新しいタスクを追加して始めましょう</p>
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