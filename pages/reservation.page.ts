import { type Page, type Locator, expect } from '@playwright/test';

export class ReservationPage {
  readonly page: Page;
  readonly roomTitle: Locator;
  readonly pricePerNight: Locator;
  readonly calendarLabel: Locator;
  readonly calendarNextButton: Locator;
  readonly reserveNowButton: Locator;
  readonly firstnameInput: Locator;
  readonly lastnameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly formReserveButton: Locator;
  readonly cancelButton: Locator;
  readonly confirmationHeading: Locator;
  readonly confirmationDates: Locator;
  readonly returnHomeLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.roomTitle = page.locator('h1.fw-bold');
    this.pricePerNight = page.locator('.booking-card .fs-2.fw-bold.text-primary');
    this.calendarLabel = page.locator('.rbc-toolbar-label');
    this.calendarNextButton = page.locator('.rbc-toolbar button:has-text("Next")');
    this.reserveNowButton = page.locator('#doReservation');
    this.firstnameInput = page.locator('input.room-firstname');
    this.lastnameInput = page.locator('input.room-lastname');
    this.emailInput = page.locator('input.room-email');
    this.phoneInput = page.locator('input.room-phone');
    this.formReserveButton = page.locator('.booking-card form button:has-text("Reserve Now")');
    this.cancelButton = page.locator('.booking-card form button:has-text("Cancel")');
    this.confirmationHeading = page.getByText('Booking Confirmed');
    this.confirmationDates = page.locator('.booking-card strong');
    this.returnHomeLink = page.locator('a:has-text("Return home")');
  }

  async goto(roomId: number, checkin: string, checkout: string): Promise<void> {
    await this.page.goto(`/reservation/${roomId}?checkin=${checkin}&checkout=${checkout}`);
    await expect(this.roomTitle).toBeVisible({ timeout: 15_000 });
  }

  async expectRoomDetailsVisible(roomType: string): Promise<void> {
    await expect(this.roomTitle).toContainText(roomType, { ignoreCase: true });
    await expect(this.pricePerNight).toBeVisible();
  }

  async clickReserveNow(): Promise<void> {
    await this.reserveNowButton.scrollIntoViewIfNeeded();
    await this.reserveNowButton.click();
    // Wait for the guest details form to appear
    await expect(this.firstnameInput).toBeVisible({ timeout: 5_000 });
  }

  async fillGuestDetails(guest: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
  }): Promise<void> {
    await this.firstnameInput.fill(guest.firstname);
    await this.lastnameInput.fill(guest.lastname);
    await this.emailInput.fill(guest.email);
    await this.phoneInput.fill(guest.phone);
  }

  async submitReservation(): Promise<void> {
    await this.formReserveButton.click();
  }

  async expectBookingConfirmed(checkin: string, checkout: string): Promise<void> {
    await expect(this.confirmationHeading).toBeVisible({ timeout: 10_000 });
    await expect(this.confirmationDates).toContainText(`${checkin} - ${checkout}`);
    await expect(this.returnHomeLink).toBeVisible();
  }
}
