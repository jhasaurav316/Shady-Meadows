import { type Page, type Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly heroSection: Locator;
  readonly bookNowHeroButton: Locator;
  readonly roomCards: Locator;
  readonly contactSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heroSection = page.locator('.hero-image, [class*="hero"]').first();
    this.bookNowHeroButton = page.locator('a[href*="rooms"], button:has-text("Book")').first();
    this.roomCards = page.locator('.hotel-room-info, [class*="room"]');
    this.contactSection = page.locator('.contact');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/Restful-booker-platform|Shady Meadows|B&B/i, { timeout: 15_000 });
  }

  async scrollToContact(): Promise<void> {
    await this.contactSection.scrollIntoViewIfNeeded();
  }

  async scrollToRooms(): Promise<void> {
    const roomsSection = this.page.locator('.hotel-room-info').first();
    await roomsSection.scrollIntoViewIfNeeded();
  }
}
