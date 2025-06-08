import React from 'react';
import { FaTasks, FaSun, FaMoon } from 'react-icons/fa';
import { useTasks } from '../../hooks/useTasks';

export const Header: React.FC = () => {
  const { stats } = useTasks();
  const currentDate = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <FaTasks className="text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">TaskFlow</h1>
              <p className="text-primary-200 text-sm mt-1">{currentDate}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-primary-200">今日のタスク</p>
              <p className="text-2xl font-bold">{stats.pending} 件</p>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div className="text-right">
              <p className="text-sm text-primary-200">完了率</p>
              <p className="text-2xl font-bold">{stats.completionRate.toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};