import { test, expect } from '../fixtures/test-fixtures';
import { adminCredentials, testRoom } from '../data/test-data';
import { uniqueRoomName } from '../utils/helpers';

test.describe('Admin Room Management — E2E Happy Path', () => {
  const roomName = uniqueRoomName();

  test('should login as admin, create a room, verify it, then delete it', async ({
    page,
    adminLoginPage,
    adminRoomsPage,
    adminNav,
  }) => {
    // ── Step 1: Navigate to admin login page ──
    await adminLoginPage.goto();
    await adminLoginPage.expectLoginFormVisible();

    // ── Step 2: Login with valid admin credentials ──
    await adminLoginPage.login(adminCredentials.username, adminCredentials.password);

    // Verify successful login — should land on rooms management page
    await adminRoomsPage.expectPageLoaded();
    await expect(page).toHaveURL(/.*\/admin\/rooms/, { timeout: 15_000 });
    await adminNav.expectNavVisible();

    // ── Step 3: Wait for existing rooms to load, then record count ──
    const initialRoomCount = await adminRoomsPage.getRoomCount();
    expect(initialRoomCount).toBeGreaterThanOrEqual(1);

    // ── Step 4: Create a new room ──
    await adminRoomsPage.createRoom({
      name: roomName,
      type: testRoom.type,
      accessible: testRoom.accessible,
      price: testRoom.price,
      features: testRoom.features,
    });

    // ── Step 5: Verify the room appears in the list ──
    await adminRoomsPage.expectRoomInList(roomName);
    const countAfterCreate = await adminRoomsPage.getRoomCount();
    expect(countAfterCreate).toBeGreaterThan(initialRoomCount);

    // ── Step 6: Delete the room we just created ──
    await adminRoomsPage.deleteRoom(roomName);

    // ── Step 7: Verify the room is removed from the list ──
    await adminRoomsPage.expectRoomNotInList(roomName);

    // ── Step 8: Logout ──
    await adminNav.logout();

    // Verify we're redirected to the homepage after logout
    await expect(page).toHaveURL(/.*automationintesting\.online\/?$/, { timeout: 10_000 });
    // Admin nav should no longer be present
    await expect(page.locator('#frontPageLink')).not.toBeVisible();
  });
});
