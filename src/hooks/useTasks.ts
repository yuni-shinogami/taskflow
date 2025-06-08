import { useMemo } from 'react';
import { useTaskContext } from '../context/TaskContext';
import type { Priority } from '../types/task';

const priorityOrder: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export const useTasks = () => {
  const { state } = useTaskContext();
  const { tasks, filter, sort } = state;

  const filteredAndSortedTasks = useMemo(() => {
    // フィルタリング
    let filtered = tasks;

    if (filter.category) {
      filtered = filtered.filter(task => task.category === filter.category);
    }

    if (filter.priority) {
      filtered = filtered.filter(task => task.priority === filter.priority);
    }

    if (filter.completed !== undefined) {
      filtered = filtered.filter(task => task.completed === filter.completed);
    }

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(
        task =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      );
    }

    // ソート
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sort.by) {
        case 'priority':
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) comparison = 0;
          else if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = a.dueDate.getTime() - b.dueDate.getTime();
          break;
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }

      return sort.order === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [tasks, filter, sort]);

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const overdue = tasks.filter(
      task => !task.completed && task.dueDate && task.dueDate < new Date()
    ).length;

    const byCategory = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byPriority = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<Priority, number>);

    return {
      total,
      completed,
      pending: total - completed,
      overdue,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      byCategory,
      byPriority,
    };
  }, [tasks]);

  return {
    tasks: filteredAndSortedTasks,
    stats: taskStats,
  };
};