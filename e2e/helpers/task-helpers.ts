import { Page } from '@playwright/test';

export class TaskHelpers {
  constructor(private page: Page) {}

  async createTask(task: {
    title: string;
    description?: string;
    priority?: 'high' | 'medium' | 'low';
    category?: 'work' | 'personal' | 'study' | 'other';
    dueDate?: Date;
  }) {
    await this.page.getByPlaceholder('タスクのタイトルを入力').fill(task.title);
    
    if (task.description) {
      await this.page.getByPlaceholder('詳細な説明（任意）').fill(task.description);
    }
    
    if (task.priority) {
      await this.page.getByRole('combobox').first().selectOption(task.priority);
    }
    
    if (task.category) {
      await this.page.getByRole('combobox').nth(1).selectOption(task.category);
    }
    
    if (task.dueDate) {
      const dateString = task.dueDate.toISOString().split('T')[0];
      await this.page.getByLabel('期限').fill(dateString);
    }
    
    await this.page.getByRole('button', { name: 'タスクを追加' }).click();
  }

  async editTask(oldTitle: string, newData: {
    title?: string;
    description?: string;
    priority?: 'high' | 'medium' | 'low';
    category?: 'work' | 'personal' | 'study' | 'other';
    dueDate?: Date;
  }) {
    const taskCard = this.page.locator('.glass-card').filter({ hasText: oldTitle });
    await taskCard.getByRole('button', { name: '編集' }).click();
    
    if (newData.title) {
      await this.page.getByPlaceholder('タスクのタイトルを入力').clear();
      await this.page.getByPlaceholder('タスクのタイトルを入力').fill(newData.title);
    }
    
    if (newData.description !== undefined) {
      await this.page.getByPlaceholder('詳細な説明（任意）').clear();
      await this.page.getByPlaceholder('詳細な説明（任意）').fill(newData.description);
    }
    
    if (newData.priority) {
      await this.page.getByRole('combobox').first().selectOption(newData.priority);
    }
    
    if (newData.category) {
      await this.page.getByRole('combobox').nth(1).selectOption(newData.category);
    }
    
    if (newData.dueDate) {
      const dateString = newData.dueDate.toISOString().split('T')[0];
      await this.page.getByLabel('期限').fill(dateString);
    }
    
    await this.page.getByRole('button', { name: 'タスクを更新' }).click();
  }

  async deleteTask(title: string) {
    const taskCard = this.page.locator('.glass-card').filter({ hasText: title });
    await taskCard.getByRole('button', { name: '削除' }).click();
  }

  async toggleTask(title: string) {
    const taskCard = this.page.locator('.glass-card').filter({ hasText: title });
    await taskCard.getByRole('checkbox').click();
  }

  async getTaskCount(): Promise<number> {
    const tasks = await this.page.locator('.glass-card').count();
    return tasks;
  }

  async getStatValue(statName: string): Promise<string> {
    const stat = await this.page.locator(`text=${statName}`).locator('..').locator('text=/\\d+/').textContent();
    return stat || '0';
  }

  async filterByCategory(category: 'all' | 'work' | 'personal' | 'study' | 'other') {
    if (category === 'all') {
      await this.page.getByRole('button', { name: 'すべて' }).click();
    } else {
      const categoryMap = {
        work: '仕事',
        personal: '個人',
        study: '勉強',
        other: 'その他'
      };
      await this.page.getByRole('button', { name: categoryMap[category] }).click();
    }
  }

  async sortBy(sortOption: 'createdAt' | 'dueDate' | 'priority') {
    await this.page.getByRole('combobox', { name: 'ソート' }).selectOption(sortOption);
  }

  async clearAllTasks() {
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
  }

  async seedTasks(count: number) {
    const tasks = [];
    const priorities = ['high', 'medium', 'low'] as const;
    const categories = ['work', 'personal', 'study', 'other'] as const;
    
    for (let i = 0; i < count; i++) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (i % 7) - 3);
      
      tasks.push({
        id: `task-${i}`,
        title: `タスク ${i + 1}`,
        description: `これはタスク ${i + 1} の説明です`,
        priority: priorities[i % 3],
        category: categories[i % 4],
        dueDate: dueDate,
        completed: i % 5 === 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    await this.page.evaluate((tasks) => {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, tasks);
    
    await this.page.reload();
  }
}