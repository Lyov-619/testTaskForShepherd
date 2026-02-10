import {expect, test} from "@playwright/test";
import {BASE_URL} from "../../resources/environment";
import {setAdminAuthCookie} from "../../utils/addCookies";
import {createRoomHelper} from "../../helpers/createRoomHelper";
import {getAdminToken} from "../../flows/adminAuthenticationFlow";
import {createRoomBody} from "../../helpers/payloads/createRoomBody";

test('create Room', async ({ request, browser }) => {
    const token = await getAdminToken(request);
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