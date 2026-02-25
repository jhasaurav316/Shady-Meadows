import { type Page, type Locator, expect } from '@playwright/test';

export class AdminLoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly invalidCredentialsAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#doLogin');
    this.invalidCredentialsAlert = page.locator('.alert-danger', { hasText: 'Invalid credentials' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/admin');
    await expect(this.loginButton).toBeVisible({ timeout: 15_000 });
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoginFormVisible(): Promise<void> {
    await expect(this.usernameInput).toBeVisible({ timeout: 10_000 });
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async expectInvalidCredentialsError(): Promise<void> {
    await expect(this.invalidCredentialsAlert).toBeVisible({ timeout: 10_000 });
    // Login form should still be visible
    await expect(this.loginButton).toBeVisible();
  }
}
