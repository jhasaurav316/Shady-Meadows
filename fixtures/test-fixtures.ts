import { test as base } from '@playwright/test';
import { AdminLoginPage, AdminRoomsPage, AdminNavPage, ContactFormPage, HomePage, ReservationPage } from '../pages';

type TestFixtures = {
  homePage: HomePage;
  adminLoginPage: AdminLoginPage;
  adminRoomsPage: AdminRoomsPage;
  adminNav: AdminNavPage;
  contactFormPage: ContactFormPage;
  reservationPage: ReservationPage;
};

export const test = base.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  adminLoginPage: async ({ page }, use) => {
    await use(new AdminLoginPage(page));
  },
  adminRoomsPage: async ({ page }, use) => {
    await use(new AdminRoomsPage(page));
  },
  adminNav: async ({ page }, use) => {
    await use(new AdminNavPage(page));
  },
  contactFormPage: async ({ page }, use) => {
    await use(new ContactFormPage(page));
  },
  reservationPage: async ({ page }, use) => {
    await use(new ReservationPage(page));
  },
});

export { expect } from '@playwright/test';
