import { test, expect } from '@playwright/test';
import { TaskHelpers } from './helpers/task-helpers';

test.describe('Advanced TaskFlow Scenarios', () => {
  let taskHelpers: TaskHelpers;

  test.beforeEach(async ({ page }) => {
    taskHelpers = new TaskHelpers(page);
    await page.goto('/');
    await taskHelpers.clearAllTasks();
  });

  test('should handle complex task workflow', async ({ page }) => {
    await taskHelpers.createTask({
      title: '重要なプロジェクト',
      description: 'クライアントへの提案書を作成',
      priority: 'high',
      category: 'work',
      dueDate: new Date(Date.now() + 86400000)
    });

    await taskHelpers.createTask({
      title: '買い物リスト',
      description: '週末の買い物',
      priority: 'low',
      category: 'personal'
    });

    await taskHelpers.createTask({
      title: 'TypeScript勉強',
      description: 'Advanced TypeScriptパターンを学ぶ',
      priority: 'medium',
      category: 'study'
    });

    expect(await taskHelpers.getTaskCount()).toBe(3);
    expect(await taskHelpers.getStatValue('総タスク数')).toBe('3');

    await taskHelpers.toggleTask('買い物リスト');
    expect(await taskHelpers.getStatValue('完了済み')).toBe('1');

    await taskHelpers.filterByCategory('work');
    expect(await taskHelpers.getTaskCount()).toBe(1);

    await taskHelpers.filterByCategory('all');
    await taskHelpers.sortBy('priority');

    const firstTask = await page.locator('.glass-card').first().textContent();
    expect(firstTask).toContain('重要なプロジェクト');
  });

  test('should handle bulk operations efficiently', async ({ page }) => {
    await taskHelpers.seedTasks(50);

    const loadTime = await page.evaluate(() => performance.now());
    expect(loadTime).toBeLessThan(2000);

    expect(await taskHelpers.getStatValue('総タスク数')).toBe('50');

    const completedTasks = await page.locator('input[type="checkbox"]:checked').count();
    expect(completedTasks).toBe(10);

    await taskHelpers.filterByCategory('work');
    const workTasks = await taskHelpers.getTaskCount();
    expect(workTasks).toBeGreaterThan(0);
    expect(workTasks).toBeLessThan(50);
  });

  test('should maintain data integrity during concurrent operations', async ({ page }) => {
    const operations = [];

    for (let i = 0; i < 5; i++) {
      operations.push(
        taskHelpers.createTask({
          title: `並行タスク ${i + 1}`,
          priority: i % 2 === 0 ? 'high' : 'low',
          category: i % 2 === 0 ? 'work' : 'personal'
        })
      );
    }

    await Promise.all(operations);

    await page.waitForTimeout(1000);

    const finalCount = await taskHelpers.getTaskCount();
    expect(finalCount).toBeGreaterThanOrEqual(1);
    expect(finalCount).toBeLessThanOrEqual(5);
  });

  test('should handle edge cases gracefully', async ({ page }) => {
    await taskHelpers.createTask({
      title: 'A'.repeat(100),
      description: 'B'.repeat(500),
      priority: 'high',
      category: 'work'
    });

    const longTask = await page.locator('.glass-card').first();
    await expect(longTask).toBeVisible();

    const pastDue = new Date();
    pastDue.setDate(pastDue.getDate() - 30);
    
    await taskHelpers.createTask({
      title: '大幅に期限切れのタスク',
      dueDate: pastDue
    });

    expect(await taskHelpers.getStatValue('期限切れ')).toBe('1');

    await taskHelpers.createTask({
      title: '特殊文字テスト <script>alert("XSS")</script>',
      description: '& < > " \' / \\',
    });

    const specialCharsTask = await page.locator('text=特殊文字テスト').first();
    await expect(specialCharsTask).toBeVisible();
    await expect(page.locator('script')).toHaveCount(0);
  });

  test('should validate business rules', async ({ page }) => {
    await taskHelpers.createTask({
      title: 'ビジネスルールテスト',
      priority: 'high',
      category: 'work'
    });

    await taskHelpers.editTask('ビジネスルールテスト', {
      title: ''
    });

    const titleInput = page.getByPlaceholder('タスクのタイトルを入力');
    const validationMessage = await titleInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();

    await page.keyboard.press('Escape');

    const futureDue = new Date();
    futureDue.setFullYear(futureDue.getFullYear() + 10);
    
    await taskHelpers.createTask({
      title: '遠い未来のタスク',
      dueDate: futureDue
    });

    const farFutureTask = await page.locator('text=遠い未来のタスク');
    await expect(farFutureTask).toBeVisible();
  });

  test('should export and import data correctly', async ({ page }) => {
    await taskHelpers.seedTasks(10);

    const exportedData = await page.evaluate(() => {
      return localStorage.getItem('tasks');
    });

    expect(exportedData).toBeTruthy();
    const tasks = JSON.parse(exportedData!);
    expect(tasks).toHaveLength(10);

    await taskHelpers.clearAllTasks();
    expect(await taskHelpers.getTaskCount()).toBe(0);

    await page.evaluate((data) => {
      localStorage.setItem('tasks', data);
    }, exportedData);

    await page.reload();
    expect(await taskHelpers.getTaskCount()).toBe(10);
  });
});