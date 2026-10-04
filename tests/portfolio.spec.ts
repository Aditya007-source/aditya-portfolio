import { test, expect } from '@playwright/test';

test('renders cleanly with no overflow across the supported widths', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [360, 390, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Signal field/ })).toBeAttached();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
  }
  expect(errors).toEqual([]);
});

test('keyboard navigation, dialog focus, and command terminal work', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.getByRole('button', { name: /Open navigation and settings/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button', { name: /Open navigation and settings/ })).toBeFocused();
  await page.keyboard.press('Control+k');
  await page.getByRole('button', { name: 'work', exact: true }).click();
  await expect(page).toHaveURL(/#work$/);
});

test('discoveries persist and the circuit is keyboard-operable', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /GIVE IT A PULSE/ }).click();
  await page.getByRole('tab', { name: /Circuit puzzle/ }).click();
  for (let i = 1; i <= 4; i++) {
    const tile = page.getByRole('button', { name: new RegExp(`Rotate circuit tile ${i},`) });
    await tile.focus(); await page.keyboard.press('Enter'); await page.keyboard.press('Enter');
  }
  await expect(page.getByText('CONNECTED. NICE WORK.')).toBeVisible();
  await page.reload();
  await expect(page.getByText('2 / 3 DISCOVERIES')).toBeVisible();
});

test('reduced motion and no-JavaScript alternatives remain usable', async ({ browser }) => {
  const reduced = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await reduced.newPage(); await page.goto('http://127.0.0.1:4173/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off'); await reduced.close();
  const staticContext = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await staticContext.newPage(); await staticPage.goto('http://127.0.0.1:4173/');
  await expect(staticPage.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(staticPage.getByRole('link', { name: /Open the live application/ })).toHaveAttribute('href', 'https://aditya-rag-online.streamlit.app/');
  await staticContext.close();
});

test('project detail previews work and direct routes survive reload', async ({ page }) => {
  await page.goto('/work/orbit/'); await page.getByRole('button', { name: /Make something tangible/ }).click(); await expect(page.getByText('2 / 3 complete')).toBeVisible();
  await page.goto('/work/prism/'); await page.getByRole('button', { name: '30 days' }).click(); await expect(page.getByRole('img', { name: /Illustrative trend over 30 days/ })).toBeVisible();
  await page.goto('/work/rag/'); await page.reload(); await expect(page.getByRole('heading', { level: 1 })).toContainText('RAG Intelligent PDF Reader'); await page.getByRole('button', { name: /Next step/ }).click(); await expect(page.getByText('Retrieve relevant source material.')).toBeVisible();
});

test('contact draft downloads locally without a submission', async ({ page }) => {
  await page.goto('/#contact');
  await page.getByLabel('Your name').fill('Test visitor');
  await page.getByLabel('What are you thinking?').fill('What if we built a playful knowledge tool?');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save a local draft' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('lets-make-something.txt');
  await expect(page.getByText('Draft saved locally. Nothing has been sent.')).toBeVisible();
});
