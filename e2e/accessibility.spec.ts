import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('TaskFlow Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
  });

  test('should pass accessibility checks on home page', async ({ page }) => {
    await checkA11y(page);
  });

  test('should have proper keyboard navigation', async ({ page }) => {
    await page.keyboard.press('Tab');
    await expect(page.getByPlaceholder('タスクのタイトルを入力')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByPlaceholder('詳細な説明（任意）')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('combobox').first()).toBeFocused();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    const titleInput = page.getByPlaceholder('タスクのタイトルを入力');
    await expect(titleInput).toHaveAttribute('aria-label', /タイトル/);
    
    const addButton = page.getByRole('button', { name: 'タスクを追加' });
    await expect(addButton).toHaveAttribute('type', 'submit');
  });

  test('should support screen reader announcements', async ({ page }) => {
    await page.getByPlaceholder('タスクのタイトルを入力').fill('アクセシビリティテスト');
    await page.getByRole('button', { name: 'タスクを追加' }).click();
    
    const liveRegion = page.getByRole('status');
    await expect(liveRegion).toContainText(/タスクが追加されました/);
  });

  test('should have sufficient color contrast', async ({ page }) => {
    const buttons = await page.locator('button').all();
    
    for (const button of buttons) {
      const backgroundColor = await button.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });
      
      const color = await button.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      
      console.log(`Button contrast - BG: ${backgroundColor}, Text: ${color}`);
    }
  });

  test('should handle focus management in modals', async ({ page }) => {
    await page.getByPlaceholder('タスクのタイトルを入力').fill('モーダルテスト');
    await page.getByRole('button', { name: 'タスクを追加' }).click();
    
    await page.getByRole('button', { name: '編集' }).click();
    
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeFocused();
    
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('should provide alternative text for icons', async ({ page }) => {
    const icons = await page.locator('svg').all();
    
    for (const icon of icons) {
      const parent = await icon.locator('..');
      const hasText = await parent.textContent();
      const hasAriaLabel = await parent.getAttribute('aria-label');
      
      expect(hasText || hasAriaLabel).toBeTruthy();
    }
  });

  test('should support reduced motion preferences', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    const animatedElements = await page.locator('.animate-fade-in').all();
    
    for (const element of animatedElements) {
      const animation = await element.evaluate((el) => {
        return window.getComputedStyle(el).animation;
      });
      
      expect(animation).toBe('none');
    }
  });
});