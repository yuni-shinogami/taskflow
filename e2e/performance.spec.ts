import { test, expect } from '@playwright/test';

test.describe('TaskFlow Performance Tests', () => {
  test('should load page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('should handle large number of tasks efficiently', async ({ page }) => {
    await page.goto('/');
    
    const taskCount = 100;
    const tasks = [];
    
    for (let i = 0; i < taskCount; i++) {
      tasks.push({
        id: `task-${i}`,
        title: `タスク ${i + 1}`,
        description: `これはタスク ${i + 1} の説明です`,
        priority: ['high', 'medium', 'low'][i % 3],
        category: ['work', 'personal', 'study', 'other'][i % 4],
        completed: i % 5 === 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    await page.evaluate((tasks) => {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, tasks);
    
    await page.reload();
    
    const startTime = Date.now();
    await page.waitForSelector('.glass-card');
    const renderTime = Date.now() - startTime;
    
    expect(renderTime).toBeLessThan(1000);
    
    const taskElements = await page.locator('.glass-card').count();
    expect(taskElements).toBeGreaterThan(0);
  });

  test('should perform smooth animations', async ({ page }) => {
    await page.goto('/');
    
    await page.getByPlaceholder('タスクのタイトルを入力').fill('アニメーションテスト');
    await page.getByRole('button', { name: 'タスクを追加' }).click();
    
    const taskCard = page.locator('.glass-card').last();
    await expect(taskCard).toHaveClass(/animate-fade-in/);
    
    await taskCard.hover();
    await expect(taskCard).toHaveCSS('transform', /scale/);
  });

  test('should efficiently update stats', async ({ page }) => {
    await page.goto('/');
    
    for (let i = 0; i < 10; i++) {
      await page.getByPlaceholder('タスクのタイトルを入力').fill(`タスク ${i + 1}`);
      await page.getByRole('button', { name: 'タスクを追加' }).click();
    }
    
    const startTime = Date.now();
    
    for (let i = 0; i < 5; i++) {
      await page.getByRole('checkbox').nth(i).click();
    }
    
    const updateTime = Date.now() - startTime;
    expect(updateTime).toBeLessThan(2000);
    
    await expect(page.getByText('50%')).toBeVisible();
  });

  test('should handle rapid user interactions', async ({ page }) => {
    await page.goto('/');
    
    await page.getByPlaceholder('タスクのタイトルを入力').fill('Rapid Test');
    
    for (let i = 0; i < 5; i++) {
      await page.getByRole('button', { name: 'タスクを追加' }).click();
      await page.waitForTimeout(100);
    }
    
    const taskCount = await page.locator('.glass-card').count();
    expect(taskCount).toBe(1);
  });

  test('should measure memory usage with many tasks', async ({ page }) => {
    await page.goto('/');
    
    const metrics = await page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
        };
      }
      return null;
    });
    
    if (metrics) {
      const heapUsageRatio = metrics.usedJSHeapSize / metrics.totalJSHeapSize;
      expect(heapUsageRatio).toBeLessThan(0.8);
    }
  });
});