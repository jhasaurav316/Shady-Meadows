import { Page, expect } from '@playwright/test';

/**
 * Wait for network to be idle after a navigation or action.
 */
export async function waitForNetworkSettled(page: Page, timeout = 5000): Promise<void> {
  try {
    await page.waitForLoadState('networkidle', { timeout });
  } catch {
    // networkidle can be flaky on slow APIs; continue if timed out
  }
}

/**
 * Generate a unique room name using timestamp suffix to avoid collisions.
 */
export function uniqueRoomName(base = '9'): string {
  const suffix = Date.now().toString().slice(-4);
  return `${base}${suffix}`;
}

/**
 * Assert that a toast/alert error message is visible on the page.
 */
export async function expectErrorVisible(page: Page, errorText: string): Promise<void> {
  const errorElement = page.getByText(errorText);
  await expect(errorElement).toBeVisible({ timeout: 10_000 });
}

/**
 * Dismiss any cookie banner if present (non-blocking).
 */
export async function dismissCookieBanner(page: Page): Promise<void> {
  try {
    const banner = page.locator('button:has-text("Accept"), button:has-text("Got it"), .cookie-banner button');
    if (await banner.isVisible({ timeout: 3000 })) {
      await banner.first().click();
    }
  } catch {
    // No cookie banner found, continue
  }
}
