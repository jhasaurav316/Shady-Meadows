import { type Page, type Locator, expect } from '@playwright/test';

export class AdminRoomsPage {
  readonly page: Page;
  readonly roomNameInput: Locator;
  readonly roomTypeSelect: Locator;
  readonly roomAccessibleSelect: Locator;
  readonly roomPriceInput: Locator;
  readonly createButton: Locator;
  readonly roomsList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.roomNameInput = page.locator('#roomName');
    this.roomTypeSelect = page.locator('#type');
    this.roomAccessibleSelect = page.locator('#accessible');
    this.roomPriceInput = page.locator('#roomPrice');
    this.createButton = page.locator('#createRoom');
    this.roomsList = page.locator('[data-testid="roomlisting"]');
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.roomNameInput).toBeVisible({ timeout: 15_000 });
    await expect(this.createButton).toBeVisible();
  }

  async createRoom(room: {
    name: string;
    type: string;
    accessible: boolean;
    price: string;
    features: string[];
  }): Promise<void> {
    await this.roomNameInput.fill(room.name);
    await this.roomTypeSelect.selectOption(room.type);
    await this.roomAccessibleSelect.selectOption(room.accessible ? 'true' : 'false');
    await this.roomPriceInput.fill(room.price);

    // Check feature checkboxes
    for (const feature of room.features) {
      const checkbox = this.page.locator(`#${feature.toLowerCase()}Checkbox`);
      if (!(await checkbox.isChecked())) {
        await checkbox.check();
      }
    }

    await this.createButton.click();
  }

  async expectRoomInList(roomName: string): Promise<void> {
    const roomRow = this.page.locator(`[data-testid="roomlisting"]`).filter({ hasText: roomName });
    await expect(roomRow).toBeVisible({ timeout: 10_000 });
  }

  async deleteRoom(roomName: string): Promise<void> {
    // Find the room row matching the name
    const roomRow = this.page.locator(`[data-testid="roomlisting"]`).filter({ hasText: roomName }).last();
    await expect(roomRow).toBeVisible();

    // Click the delete (×) button and wait for the DELETE network request
    const deleteButton = roomRow.locator('.roomDelete');
    await Promise.all([
      this.page.waitForResponse(resp => resp.url().includes('/room/') && resp.request().method() === 'DELETE'),
      deleteButton.click(),
    ]);
  }

  async expectRoomNotInList(roomName: string): Promise<void> {
    const roomRow = this.page.locator(`[data-testid="roomlisting"]`).filter({ hasText: roomName });
    await expect(roomRow).toHaveCount(0, { timeout: 10_000 });
  }

  async getRoomCount(): Promise<number> {
    // Wait for at least one room to be loaded before counting
    await expect(this.page.locator('[data-testid="roomlisting"]').first()).toBeVisible({ timeout: 10_000 });
    return await this.page.locator('[data-testid="roomlisting"]').count();
  }
}
