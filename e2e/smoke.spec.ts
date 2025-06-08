import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('application should load successfully', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    
    await expect(page).toHaveTitle(/Todo/);
    await expect(page.getByRole('heading', { name: 'TaskFlow' })).toBeVisible();
  });

  test('should have all main sections visible', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('button', { name: '新しいタスクを追加' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'フィルター・並び替え' })).toBeVisible();
    await expect(page.getByText('総タスク数')).toBeVisible();
  });

  test('should be responsive', async ({ page, viewport }) => {
    if (!viewport) return;
    
    await page.goto('/');
    
    const sizes = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];
    
    for (const size of sizes) {
      await page.setViewportSize({ width: size.width, height: size.height });
      await expect(page.getByRole('heading', { name: 'TaskFlow' })).toBeVisible();
    }
  });
});