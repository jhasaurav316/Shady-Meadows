import { test, expect } from '../fixtures/test-fixtures';
import {
  invalidCredentials,
  contactFormInvalid,
  contactFormValid,
  contactFormExpectedErrors,
} from '../data/test-data';

test.describe('Validation & Negative Scenarios', () => {

  test.describe('Admin Login — Invalid Credentials', () => {
    test('should show error and remain on login when credentials are wrong', async ({
      page,
      adminLoginPage,
    }) => {
      await adminLoginPage.goto();
      await adminLoginPage.expectLoginFormVisible();

      // Attempt login with invalid credentials
      await adminLoginPage.login(invalidCredentials.username, invalidCredentials.password);

      // Should show "Invalid credentials" error and remain on login page
      await adminLoginPage.expectInvalidCredentialsError();
      await expect(page).toHaveURL(/.*\/admin$/);

      // Should NOT navigate to rooms management (still on login)
      await expect(page.locator('#roomName')).not.toBeVisible();
    });
  });

  test.describe('Contact Form — Blank Submission', () => {
    test('should display validation errors when submitting empty form', async ({
      contactFormPage,
    }) => {
      await contactFormPage.goto();

      // Submit without filling any fields
      await contactFormPage.submit();

      // Verify validation error messages appear
      await contactFormPage.expectValidationErrors(
        contactFormExpectedErrors.blank
      );
    });
  });

  test.describe('Contact Form — Invalid Input Lengths', () => {
    test('should display validation errors for fields with invalid lengths', async ({
      contactFormPage,
    }) => {
      await contactFormPage.goto();

      // Fill with invalid data (too short values)
      await contactFormPage.fillForm(contactFormInvalid);
      await contactFormPage.submit();

      // Verify length validation errors
      await contactFormPage.expectValidationErrors(
        contactFormExpectedErrors.invalid
      );
    });
  });

  test.describe('Contact Form — Successful Submission', () => {
    test('should show success message when submitting valid contact form', async ({
      contactFormPage,
    }) => {
      await contactFormPage.goto();

      // Fill with valid data
      await contactFormPage.fillForm(contactFormValid);
      await contactFormPage.submit();

      // Verify success confirmation message
      await contactFormPage.expectSuccessMessage(contactFormValid.name);
    });
  });
});
