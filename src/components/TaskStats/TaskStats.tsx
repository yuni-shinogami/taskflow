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
      color: 'bg-blue-500',
    },
    {
      title: '完了済み',
      value: stats.completed,
      icon: <FaCheckCircle />,
      color: 'bg-green-500',
    },
    {
      title: '未完了',
      value: stats.pending,
      icon: <FaClock />,
      color: 'bg-yellow-500',
    },
    {
      title: '期限切れ',
      value: stats.overdue,
      icon: <FaExclamationTriangle />,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <FaChartPie className="text-gray-600" />
        <h2 className="text-lg font-semibold">統計情報</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">{stat.title}</span>
              <div className={`${stat.color} text-white p-2 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {stats.total > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">完了率</span>
            <span className="text-lg font-semibold">
              {stats.completionRate.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};