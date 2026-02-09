import {test, expect} from '@playwright/test';
import {getAdminToken} from "../../flows/adminAuthenticationFlow";
import {setAdminAuthCookie} from '../../utils/addCookies'
import { createRoomBody } from "../../helpers/payloads/createRoomBody";
import {BASE_URL} from "../../resources/environment";
import {USERS} from "../../resources/constants/userCredentials";
import {createRoomHelper} from "../../helpers/createRoomHelper";
import {DATE_FOR_RESERVING_ROOM} from "../../resources/constants/dateForReservingSpecificRoom";


let token;

test.beforeEach("should login as admin and set authentication cookie for browser", async ({request})=> {
  token = await getAdminToken(request);

})

test('login to Admin page', async ({page }) => {
  await page.goto(`${BASE_URL}/admin`);

  const userNameField = await page.locator('#username');
  const passwordField = await page.locator('#password');
  const loginButton = await page.locator('#doLogin');
  await expect(userNameField).toBeVisible();
  await expect(passwordField).toBeVisible();
  await expect(loginButton).toBeVisible();

  await userNameField.fill(USERS.ADMIN.username);
  await passwordField.fill(USERS.ADMIN.password);
  await loginButton.click();
  await page.waitForURL(`${BASE_URL}/admin/rooms`, { timeout: 5000 });
  expect(page.url()).toBe(`${BASE_URL}/admin/rooms`);

});

test('logout', async ({page}) => {
  await page.goto(`${BASE_URL}/admin`);

  const userNameField = await page.locator('#username');
  const passwordField = await page.locator('#password');
  const loginButton = await page.locator('#doLogin');
  await expect(userNameField).toBeVisible();
  await expect(passwordField).toBeVisible();
  await expect(loginButton).toBeVisible();

  await userNameField.fill(USERS.ADMIN.username);
  await passwordField.fill(USERS.ADMIN.password);
  await loginButton.click();
  await page.waitForURL(`${BASE_URL}/admin/rooms`, { timeout: 5000 });
  expect(page.url()).toBe(`${BASE_URL}/admin/rooms`);

  const logOutButton = await page.locator('.btn-outline-danger')
  await expect(logOutButton).toBeVisible()
  await logOutButton.click()

  await page.waitForURL(`${BASE_URL}`, { timeout: 5000 });
  expect(page.url()).toBe(`${BASE_URL}/`);

})

test('create room via API → verify it appears in UI admin panel', async ({ request, browser }) => {
  const roomBody = createRoomBody;
  const response = await createRoomHelper(request, token, roomBody);
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(responseBody).toEqual({success: true});

  const myPage = await setAdminAuthCookie(browser, token);
  await myPage.goto(`${BASE_URL}/admin/rooms`);
  await myPage.waitForURL(`${BASE_URL}/admin/rooms`, { timeout: 5000 });
  expect(myPage.url()).toBe(`${BASE_URL}/admin/rooms`);

  const roomRow = myPage.locator('div[data-testid="roomlisting"]', {
    has: myPage.locator(`#roomName${roomBody.roomName}`)
  });

  await expect(roomRow.locator(`#type${roomBody.type}`)).toHaveText(roomBody.type);
  await expect(roomRow.locator(`#accessible${roomBody.accessible}`)).toHaveText(String(roomBody.accessible));
  await expect(roomRow.locator(`#roomPrice${roomBody.roomPrice}`)).toHaveText(roomBody.roomPrice);
  await expect(roomRow.locator('p[id^="details"]')).toHaveText(roomBody.features.join(', '));
});


test('UI: book Room', async ({ page }) => {
  await page.goto(`${BASE_URL}`);

  const roomId = DATE_FOR_RESERVING_ROOM.DATE.roomId
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



