import React from 'react';
import { useTasks } from '../../hooks/useTasks';
import { 
  FaChartPie, 
  FaCheckCircle, 
  FaClock, 
  FaExclamationTriangle,
  FaTasks
} from 'react-icons/fa';

export const TaskStats: React.FC = () => {
  const { stats } = useTasks();

  const statCards = [
    {
      title: '総タスク数',
      value: stats.total,
      icon: <FaTasks />,
      gradient: 'from-primary-400 to-primary-600',
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
    },
    {
      title: '完了済み',
      value: stats.completed,
      icon: <FaCheckCircle />,
      gradient: 'from-emerald-400 to-emerald-600',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      title: '未完了',
      value: stats.pending,
      icon: <FaClock />,
      gradient: 'from-amber-400 to-amber-600',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      title: '期限切れ',
      value: stats.overdue,
      icon: <FaExclamationTriangle />,
      gradient: 'from-red-400 to-red-600',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="glass-card rounded-xl p-5 hover:scale-105 transition-transform duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat.iconBg} p-3 rounded-xl`}>
                <div className={`${stat.iconColor} text-xl`}>
                  {stat.icon}
                </div>
              </div>
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
            </div>
            <p className="text-slate-600 text-sm font-medium">{stat.title}</p>
          </div>
        ))}
      </div>

      {stats.total > 0 && (
        <div className="glass-card rounded-xl p-5 mt-6 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <FaChartPie className="text-emerald-600 text-lg" />
              </div>
              <span className="text-slate-700 font-medium">完了率</span>
            </div>
            <span className="text-2xl font-bold text-emerald-600">
              {stats.completionRate.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};