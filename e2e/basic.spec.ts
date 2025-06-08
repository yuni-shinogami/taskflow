import { test, expect } from '@playwright/test';

test.describe('Basic TaskFlow Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('ページが正しく表示される', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'TaskFlow' })).toBeVisible();
    await expect(page.getByText('今日のタスク')).toBeVisible();
    await expect(page.getByText('0 件')).toBeVisible();
  });

  test('新しいタスクを追加できる', async ({ page }) => {
    // タスク追加ボタンをクリック
    await page.getByRole('button', { name: '新しいタスクを追加' }).click();
    
    // フォームが表示されることを確認
    await expect(page.getByText('新しいタスクを作成')).toBeVisible();
    
    // タスク情報を入力
    await page.getByPlaceholder('タスクのタイトルを入力').fill('テストタスク');
    await page.getByPlaceholder('詳細な説明（任意）').fill('これはテストです');
    
    // タスクを追加
    await page.getByRole('button', { name: 'タスクを追加' }).click();
    
    // タスクが表示されることを確認
    await expect(page.getByText('テストタスク')).toBeVisible();
    await expect(page.getByText('これはテストです')).toBeVisible();
    
    // 統計が更新されることを確認
    await expect(page.getByText('1 件')).toBeVisible();
  });

  test('タスクを完了できる', async ({ page }) => {
    // タスクを追加
    await page.getByRole('button', { name: '新しいタスクを追加' }).click();
    await page.getByPlaceholder('タスクのタイトルを入力').fill('完了するタスク');
    await page.getByRole('button', { name: 'タスクを追加' }).click();
    
    // フォームが閉じるのを待つ
    await expect(page.getByText('新しいタスクを作成')).not.toBeVisible();
    
    // タスクが表示されるのを待つ
    await expect(page.getByRole('heading', { name: '完了するタスク' })).toBeVisible();
    
    // タスクカード内のチェックボックスボタンをクリック
    const taskCard = page.locator('div').filter({ hasText: '完了するタスク' }).first();
    await taskCard.locator('button').first().click();
    
    // 完了率が更新されることを確認（タスクが完了すると100%になる）
    await expect(page.getByText('100%')).toBeVisible();
    
    // 完了済みタスク数が1になることを確認
    await expect(page.getByText('完了済み').locator('..').getByText('1')).toBeVisible();
  });

  test('タスクを削除できる', async ({ page }) => {
    // タスクを追加
    await page.getByRole('button', { name: '新しいタスクを追加' }).click();
    await page.getByPlaceholder('タスクのタイトルを入力').fill('削除するタスク');
    await page.getByRole('button', { name: 'タスクを追加' }).click();
    
    // 削除ボタンをクリック
    await page.getByRole('button', { name: '削除' }).click();
    
    // 確認ダイアログで削除を実行
    await page.getByRole('button', { name: '削除する' }).click();
    
    // タスクが削除されることを確認
    await expect(page.getByText('削除するタスク')).not.toBeVisible();
    await expect(page.getByText('タスクがありません')).toBeVisible();
  });
});