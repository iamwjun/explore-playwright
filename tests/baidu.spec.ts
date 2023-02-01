import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.baidu.com/');
  await page.locator('#kw').click();
  await page.locator('#kw').fill('');
  await page.locator('#kw').press('CapsLock');
  await page.locator('#kw').fill('中国年');
  await page.locator('#kw').press('Enter');
  await page.getByTitle('清空').click();
  await page.getByRole('link', { name: '到百度首页' }).click();
});