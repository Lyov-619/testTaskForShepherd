import {expect, test} from "@playwright/test";
import {createRoomHelper} from "../../../helpers/createRoomHelper";
import {getAdminToken} from "../../../flows/adminAuthenticationFlow";
import {createRoomBody} from "../../../helpers/payloads/createRoomBody";

let adminToken;

test.beforeEach(" should get Admin Token", async ({request}) => {
    adminToken = await getAdminToken(request);
})

test('Create Room', async ({request}) => {
    const createRoomRequestBody = createRoomBody;
    const response = await createRoomHelper(request, adminToken, createRoomRequestBody);
    expect(response.status(),  `FAILED TO CREATE ROOM ${JSON.stringify(createRoomRequestBody)}`)
        .toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toEqual({ success: true });
})

test('try to create room without roomName', async ({ request }) => {
    const createRoomRequestBody = { ...createRoomBody, roomName: '' };

    const response = await createRoomHelper(request, adminToken, createRoomRequestBody);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.status()).toBe(400);
    expect(responseBody.errors).toContain("Room name must be set");

});

test('try to create room with negative price', async ({ request }) => {
    const createRoomRequestBody = { ...createRoomBody, roomPrice: -50 };
    const response = await createRoomHelper(request, adminToken, createRoomRequestBody);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.status()).toBe(400);
    expect(responseBody.errors).toContain("must be greater than or equal to 1");
});

test('try to create room with 0 room price', async ({ request }) => {
    const createRoomRequestBody = { ...createRoomBody, roomPrice: 0 };
    const response = await createRoomHelper(request, adminToken, createRoomRequestBody);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.status()).toBe(400);
    expect(responseBody.errors).toContain("must be greater than or equal to 1");
});

test('try to create room with string type, room price', async ({ request }) => {
    const createRoomRequestBody = { ...createRoomBody, roomPrice: 'text' };
    const response = await createRoomHelper(request, adminToken, createRoomRequestBody);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.status()).toBe(400);
    expect(responseBody.errors).toContain("Failed to create room");

});

test('try to create room without authorization', async ({ request }) => {
    const createRoomRequestBody = { ...createRoomBody, roomName: `NoAuth_${Date.now()}` };
    const response = await createRoomHelper(request, '', createRoomRequestBody);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.status()).toBe(500);
    expect(responseBody.errors).toContain("An unexpected error occurred");
});

test('try to create room with non existing type', async ({ request }) => {
    const createRoomRequestBody = { ...createRoomBody, type: 'Luxury' };
    const response = await createRoomHelper(request, adminToken, createRoomRequestBody);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.status()).toBe(400);
    expect(responseBody.errors).toContain("Type can only contain the room options Single, Double, Twin, Family or Suite");

});

test('try to create room with empty type', async ({ request }) => {
    const createRoomRequestBody = { ...createRoomBody, type: '' };
    const response = await createRoomHelper(request, adminToken, createRoomRequestBody);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.status()).toBe(400);
    expect(responseBody.errors).toContain("Type can only contain the room options Single, Double, Twin, Family or Suite");

});

test('try to create room with non-boolean value for accessible field', async ({ request }) => {
    const createRoomRequestBody = { ...createRoomBody, accessible: 'yes' };
    const response = await createRoomHelper(request, adminToken, createRoomRequestBody);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.status()).toBe(400);
    expect(responseBody.errors).toContain("Failed to create room");

});

test('try to create room with features — not list ', async ({ request }) => {
    const createRoomRequestBody = { ...createRoomBody, features: 'WiFi,TV' };
    const response = await createRoomHelper(request, adminToken, createRoomRequestBody);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.status()).toBe(500);
    expect(responseBody.errors).toContain("Failed to create room");
});

test('try to create room with an invalid value', async ({ request }) => {
    const createRoomRequestBody = { ...createRoomBody, features: ['WiFi1', true, 'Pool',] };
    const response = await createRoomHelper(request, adminToken, createRoomRequestBody);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.status()).toBe(400);
    expect(responseBody.errors).toContain("Failed to create room");
});