import { type Page, type Locator, expect } from '@playwright/test';

export class ContactFormPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly subjectInput: Locator;
  readonly descriptionInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('[data-testid="ContactName"]');
    this.emailInput = page.locator('[data-testid="ContactEmail"]');
    this.phoneInput = page.locator('[data-testid="ContactPhone"]');
    this.subjectInput = page.locator('[data-testid="ContactSubject"]');
    this.descriptionInput = page.locator('[data-testid="ContactDescription"]');
    this.submitButton = page.locator('#contact button:has-text("Submit")');
    this.errorAlert = page.locator('#contact .alert-danger');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(this.submitButton).toBeVisible({ timeout: 15_000 });
  }

  async fillForm(data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    description: string;
  }): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.phoneInput.fill(data.phone);
    await this.subjectInput.fill(data.subject);
    await this.descriptionInput.fill(data.description);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async expectSuccessMessage(name: string): Promise<void> {
    const successHeading = this.page.getByText(`Thanks for getting in touch ${name}!`);
    await expect(successHeading).toBeVisible({ timeout: 15_000 });
  }

  async expectValidationErrors(expectedErrors: string[]): Promise<void> {
    // Wait for the error alert container to appear
    await expect(this.errorAlert).toBeVisible({ timeout: 10_000 });

    // Each error is a <p> inside the .alert-danger div
    for (const errorMsg of expectedErrors) {
      const errorP = this.errorAlert.locator('p', { hasText: errorMsg });
      await expect(errorP).toBeVisible({ timeout: 5_000 });
    }
  }
}
