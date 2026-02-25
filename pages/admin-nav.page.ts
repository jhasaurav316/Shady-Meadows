import { type Page, type Locator, expect } from '@playwright/test';

export class AdminNavPage {
  readonly page: Page;
  readonly roomsLink: Locator;
  readonly reportLink: Locator;
  readonly brandingLink: Locator;
  readonly frontPageLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.roomsLink = page.locator('a[href="/admin/rooms"]');
    this.reportLink = page.locator('#reportLink');
    this.brandingLink = page.locator('#brandingLink');
    this.frontPageLink = page.locator('#frontPageLink');
    this.logoutButton = page.locator('button:has-text("Logout")');
  }

  async expectNavVisible(): Promise<void> {
    await expect(this.frontPageLink).toBeVisible({ timeout: 10_000 });
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async goToRooms(): Promise<void> {
    await this.roomsLink.click();
  }

  async goToReport(): Promise<void> {
    await this.reportLink.click();
  }

  async goToBranding(): Promise<void> {
    await this.brandingLink.click();
  }

  async goToFrontPage(): Promise<void> {
    await this.frontPageLink.click();
  }
}
