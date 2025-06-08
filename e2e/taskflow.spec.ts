import { test, expect } from '@playwright/test';

test.describe('TaskFlow Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display the header with TaskFlow title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'TaskFlow' })).toBeVisible();
    await expect(page.getByText(/今日のタスク/)).toBeVisible();
    await expect(page.getByText(/完了率/)).toBeVisible();
  });

  test('should display task stats cards', async ({ page }) => {
    await expect(page.getByText('総タスク数')).toBeVisible();
    await expect(page.getByText('完了済み')).toBeVisible();
    await expect(page.getByText('未完了')).toBeVisible();
    await expect(page.getByText('期限切れ')).toBeVisible();
  });

  test('should create a new task', async ({ page }) => {
    await page.getByPlaceholder('タスクのタイトルを入力').fill('新しいタスク');
    await page.getByPlaceholder('詳細な説明（任意）').fill('これはテストタスクです');
    
    await page.getByRole('combobox').first().selectOption('high');
    await page.getByRole('combobox').nth(1).selectOption('work');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await page.getByLabel('期限').fill(dateString);
    
    await page.getByRole('button', { name: 'タスクを追加' }).click();
    
    await expect(page.getByText('新しいタスク')).toBeVisible();
    await expect(page.getByText('これはテストタスクです')).toBeVisible();
    await expect(page.getByText('高')).toBeVisible();
    await expect(page.getByText('仕事')).toBeVisible();
  });

  test('should edit a task', async ({ page }) => {
    await page.getByPlaceholder('タスクのタイトルを入力').fill('編集前のタスク');
    await page.getByRole('button', { name: 'タスクを追加' }).click();
    
    await page.getByRole('button', { name: '編集' }).click();
    
    await page.getByPlaceholder('タスクのタイトルを入力').fill('編集後のタスク');
    await page.getByPlaceholder('詳細な説明（任意）').fill('編集された説明');
    await page.getByRole('button', { name: 'タスクを更新' }).click();
    
    await expect(page.getByText('編集後のタスク')).toBeVisible();
    await expect(page.getByText('編集された説明')).toBeVisible();
  });

  test('should complete a task', async ({ page }) => {
    await page.getByPlaceholder('タスクのタイトルを入力').fill('完了するタスク');
    await page.getByRole('button', { name: 'タスクを追加' }).click();
    
    await page.getByRole('checkbox').click();
    
    await expect(page.getByText('完了するタスク')).toHaveClass(/line-through/);
    
    const completedCount = await page.locator('text=完了済み').locator('..').locator('text=/\\d+/').textContent();
    expect(completedCount).toBe('1');
  });

  test('should delete a task', async ({ page }) => {
    await page.getByPlaceholder('タスクのタイトルを入力').fill('削除するタスク');
    await page.getByRole('button', { name: 'タスクを追加' }).click();
    
    await page.getByRole('button', { name: '削除' }).click();
    
    await expect(page.getByText('削除するタスク')).not.toBeVisible();
    
    const totalCount = await page.locator('text=総タスク数').locator('..').locator('text=/\\d+/').textContent();
    expect(totalCount).toBe('0');
  });

  test('should filter tasks by category', async ({ page }) => {
    await page.getByPlaceholder('タスクのタイトルを入力').fill('仕事のタスク');
    await page.getByRole('combobox').nth(1).selectOption('work');
    await page.getByRole('button', { name: 'タスクを追加' }).click();
    
    await page.getByPlaceholder('タスクのタイトルを入力').fill('個人のタスク');
    await page.getByRole('combobox').nth(1).selectOption('personal');
    await page.getByRole('button', { name: 'タスクを追加' }).click();
    
    await page.getByRole('button', { name: '仕事' }).click();
    
    await expect(page.getByText('仕事のタスク')).toBeVisible();
    await expect(page.getByText('個人のタスク')).not.toBeVisible();
  });

  test('should sort tasks by priority', async ({ page }) => {
    await page.getByPlaceholder('タスクのタイトルを入力').fill('低優先度タスク');
    await page.getByRole('combobox').first().selectOption('low');
    await page.getByRole('button', { name: 'タスクを追加' }).click();
    
    await page.getByPlaceholder('タスクのタイトルを入力').fill('高優先度タスク');
    await page.getByRole('combobox').first().selectOption('high');
    await page.getByRole('button', { name: 'タスクを追加' }).click();
    
    await page.getByRole('combobox', { name: 'ソート' }).selectOption('priority');
    
    const tasks = await page.locator('.glass-card').allTextContents();
    expect(tasks[0]).toContain('高優先度タスク');
    expect(tasks[1]).toContain('低優先度タスク');
  });

  test('should persist tasks after page reload', async ({ page }) => {
    await page.getByPlaceholder('タスクのタイトルを入力').fill('永続化テストタスク');
    await page.getByRole('button', { name: 'タスクを追加' }).click();
    
    await page.reload();
    
    await expect(page.getByText('永続化テストタスク')).toBeVisible();
  });

  test('should show overdue tasks', async ({ page }) => {
    await page.getByPlaceholder('タスクのタイトルを入力').fill('期限切れタスク');
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateString = yesterday.toISOString().split('T')[0];
    await page.getByLabel('期限').fill(dateString);
    
    await page.getByRole('button', { name: 'タスクを追加' }).click();
    
    await expect(page.getByText('期限切れ')).toBeVisible();
    
    const overdueCount = await page.locator('text=期限切れ').locator('..').locator('text=/\\d+/').textContent();
    expect(overdueCount).toBe('1');
  });

  test('should update completion rate', async ({ page }) => {
    await page.getByPlaceholder('タスクのタイトルを入力').fill('タスク1');
    await page.getByRole('button', { name: 'タスクを追加' }).click();
    
    await page.getByPlaceholder('タスクのタイトルを入力').fill('タスク2');
    await page.getByRole('button', { name: 'タスクを追加' }).click();
    
    await page.getByRole('checkbox').first().click();
    
    await expect(page.getByText('50%')).toBeVisible();
    
    await page.getByRole('checkbox').nth(1).click();
    
    await expect(page.getByText('100%')).toBeVisible();
  });

  test('should show empty state when no tasks', async ({ page }) => {
    await expect(page.getByText('タスクがありません')).toBeVisible();
    await expect(page.getByText('新しいタスクを追加してください')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.getByRole('button', { name: 'タスクを追加' }).click();
    
    const titleInput = page.getByPlaceholder('タスクのタイトルを入力');
    await expect(titleInput).toHaveAttribute('required');
  });

  test('should display responsive layout on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await expect(page.getByRole('heading', { name: 'TaskFlow' })).toBeVisible();
    
    const statsGrid = page.locator('.grid').first();
    await expect(statsGrid).toHaveClass(/grid-cols-2/);
  });
});