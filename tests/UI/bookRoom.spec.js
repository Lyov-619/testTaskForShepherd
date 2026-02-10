import {expect, test} from "@playwright/test";
import {BASE_URL} from "../../resources/environment";
import {DATE_FOR_RESERVING_ROOM} from "../../resources/constants/dateForReservingSpecificRoom";
import {roomid} from "../../resources/constants/roomID";

test('book Room', async ({ page }) => {
    await page.goto(`${BASE_URL}`);

    const roomId = roomid
    const checkInDate = DATE_FOR_RESERVING_ROOM.DATE.checkin
    const checkOutDate = DATE_FOR_RESERVING_ROOM.DATE.checkout
    await page.locator(`a[href^="/reservation/${roomId}?checkin=${checkInDate}&checkout=${checkOutDate}"]`).click();
    await page.locator('#doReservation').click();
    await page.waitForLoadState('load');
    await page.getByPlaceholder('Firstname').fill("John");
    await page.getByPlaceholder('Lastname').fill("Smith");
    await page.getByPlaceholder('Email').fill("johnsmith@gmail.com");
    await page.getByPlaceholder('Phone').fill("+37498410548");
    await page.locator('.btn-primary').click();
    await page.waitForLoadState('load');

    const expectedText = 'Your booking has been confirmed for the following dates:'
    const bookingCard = page.locator('div.card-body', { hasText: expectedText });
    await expect(bookingCard.locator('strong')).toHaveText(`${checkInDate} - ${checkOutDate}`);

});