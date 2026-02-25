import { test, expect } from '../fixtures/test-fixtures';
import { bookingGuest, getFutureBookingDates } from '../data/test-data';

test.describe('Room Booking — E2E User Journey', () => {
  // Use randomized future dates to avoid conflicts on the shared demo app
  const { checkin, checkout } = getFutureBookingDates(
    120 + Math.floor(Math.random() * 60),
    2
  );

  test('should browse room, fill guest details, and complete booking', async ({
    page,
    homePage,
    reservationPage,
  }) => {
    // ── Step 1: Start on the homepage ──
    await homePage.goto();
    await homePage.expectLoaded();

    // ── Step 2: Click "Book now" on the first room card ──
    const roomCard = page.locator('.room-card').first();
    await roomCard.scrollIntoViewIfNeeded();
    const bookNowLink = roomCard.locator('a.btn:has-text("Book now")');
    await expect(bookNowLink).toBeVisible();
    // Verify the link points to a reservation page
    const href = await bookNowLink.getAttribute('href');
    expect(href).toContain('/reservation/');

    // ── Step 3: Navigate to reservation page with our chosen dates ──
    // Extract room ID from the href and build URL with future dates
    const roomIdMatch = href!.match(/\/reservation\/(\d+)/);
    const roomId = roomIdMatch ? roomIdMatch[1] : '1';
    await reservationPage.goto(Number(roomId), checkin, checkout);

    // ── Step 4: Verify room details are visible ──
    await reservationPage.expectRoomDetailsVisible('Single');

    // ── Step 5: Click "Reserve Now" to open the guest details form ──
    await reservationPage.clickReserveNow();

    // Verify the form inputs are visible
    await expect(reservationPage.firstnameInput).toBeVisible();
    await expect(reservationPage.lastnameInput).toBeVisible();
    await expect(reservationPage.emailInput).toBeVisible();
    await expect(reservationPage.phoneInput).toBeVisible();

    // ── Step 6: Fill in guest details ──
    await reservationPage.fillGuestDetails(bookingGuest);

    // ── Step 7: Submit the reservation ──
    await reservationPage.submitReservation();

    // ── Step 8: Verify booking confirmation ──
    await expect(reservationPage.confirmationHeading).toBeVisible({ timeout: 10_000 });
    await expect(reservationPage.confirmationDates).toContainText(checkin);
    await expect(reservationPage.returnHomeLink).toBeVisible();

    // ── Step 9: Return to homepage ──
    await reservationPage.returnHomeLink.click();
    await expect(page).toHaveURL(/.*automationintesting\.online\/?$/, { timeout: 10_000 });
  });
});
