import {expect, test} from "@playwright/test";
import {BASE_URL} from "../../resources/environment";
import {USERS} from "../../resources/constants/userCredentials";

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