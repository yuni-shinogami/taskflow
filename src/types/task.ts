export type Priority = 'high' | 'medium' | 'low';
export type Category = 'work' | 'personal' | 'study' | 'other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  category: Category;
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFilter {
  category?: Category;
  priority?: Priority;
  completed?: boolean;
  searchQuery?: string;
}

export type SortBy = 'priority' | 'dueDate' | 'createdAt' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface TaskSort {
  by: SortBy;
  order: SortOrder;
}