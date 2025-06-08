import React from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { FaFilter, FaSearch } from 'react-icons/fa';

export const TaskFilter: React.FC = () => {
  const { state, setFilter, setSort } = useTaskContext();
  const { filter, sort } = state;

  const handleFilterChange = (key: string, value: any) => {
    setFilter({
      ...filter,
      [key]: value === '' ? undefined : value,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [by, order] = e.target.value.split('-') as any;
    setSort({ by, order });
  };

  return (
    <div className="glass-card rounded-xl p-5 mb-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-primary-100 p-2 rounded-lg">
          <FaFilter className="text-primary-600 text-lg" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">フィルター・並び替え</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 検索 */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="検索..."
            value={filter.searchQuery || ''}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 bg-white/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* カテゴリー */}
        <select
          value={filter.category || ''}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="input-field"
        >
          <option value="">すべてのカテゴリー</option>
          <option value="work">仕事</option>
          <option value="personal">個人</option>
          <option value="study">学習</option>
          <option value="other">その他</option>
        </select>

        {/* 優先度 */}
        <select
          value={filter.priority || ''}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className="input-field"
        >
          <option value="">すべての優先度</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>

        {/* 完了状態 */}
        <select
          value={filter.completed === undefined ? '' : filter.completed.toString()}
          onChange={(e) => handleFilterChange('completed', e.target.value === '' ? undefined : e.target.value === 'true')}
          className="input-field"
        >
          <option value="">すべてのタスク</option>
          <option value="false">未完了</option>
          <option value="true">完了済み</option>
        </select>

        {/* 並び替え */}
        <select
          value={`${sort.by}-${sort.order}`}
          onChange={handleSortChange}
          className="input-field"
        >
          <option value="createdAt-desc">作成日（新しい順）</option>
          <option value="createdAt-asc">作成日（古い順）</option>
          <option value="dueDate-asc">期限（近い順）</option>
          <option value="dueDate-desc">期限（遠い順）</option>
          <option value="priority-desc">優先度（高い順）</option>
          <option value="priority-asc">優先度（低い順）</option>
          <option value="title-asc">タイトル（A-Z）</option>
          <option value="title-desc">タイトル（Z-A）</option>
        </select>
      </div>
    </div>
  );
};