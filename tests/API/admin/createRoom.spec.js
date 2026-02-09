import {expect, test} from "@playwright/test";
import {createRoomBody} from "../../../helpers/payloads/createRoomBody";
import {createRoomHelper} from "../../../helpers/createRoomHelper";
import {getAdminToken} from "../../../flows/adminAuthenticationFlow";
import {getRoomsRequest} from "../../../flows/getRoomsFlow";
import {deleteRoomRequest} from "../../../helpers/deleteRoomHelper";

let adminToken;

test.beforeEach(" should get Admin Token", async ({request}) => {
    adminToken = await getAdminToken(request);
})

test('API: Create Room', async ({request}) => {
    const createRoomRequestBody = createRoomBody;
    const response = await createRoomHelper(request, adminToken, createRoomRequestBody);
    expect(response.status(),  `FAILED TO CREATE ROOM ${JSON.stringify(createRoomRequestBody)}`)
        .toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toEqual({ success: true });
})

test("should delete Room by roomid", async ({request}) => {
    const response = await createRoomHelper(request, adminToken, createRoomBody);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toEqual({success: true});

    const getRoomsResponse = await getRoomsRequest(request);
    expect(getRoomsResponse.response.status()).toBe(200);
    expect(getRoomsResponse.responseBody.rooms.length).toBeGreaterThanOrEqual(0);

    const rooms = getRoomsResponse.responseBody.rooms
    const createdRoom = rooms.find(
        room => room.roomName === createRoomBody.roomName
    )

    const responseDelete = await deleteRoomRequest(request, adminToken, createdRoom.roomid);
    const responseBodyDelete = await response.json();
    expect(responseDelete.status()).toBe(200);
    expect(responseBodyDelete).toEqual({success: true});
})

test('negative: should fail without roomName', async ({ request }) => {
    const createRoomRequestBody = { ...createRoomBody, roomName: '' };

    const response = await createRoomHelper(request, adminToken, createRoomRequestBody);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.status()).toBe(400);
    expect(responseBody.errors).toContain("Room name must be set");

});

test('negative: should fail with negative price', async ({ request }) => {
    const createRoomRequestBody = { ...createRoomBody, roomPrice: -50 };
    const response = await createRoomHelper(request, adminToken, createRoomRequestBody);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.status()).toBe(400);
    expect(responseBody.errors).toContain("must be greater than or equal to 1");
});

test('negative: should fail with 0 room price', async ({ request }) => {
    const createRoomRequestBody = { ...createRoomBody, roomPrice: 0 };
    const response = await createRoomHelper(request, adminToken, createRoomRequestBody);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.status()).toBe(400);
    expect(responseBody.errors).toContain("must be greater than or equal to 1");
});

test('negative: should fail, with string type, room price', async ({ request }) => {
    const createRoomRequestBody = { ...createRoomBody, roomPrice: 'text' };
    const response = await createRoomHelper(request, adminToken, createRoomRequestBody);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.status()).toBe(400);
    expect(responseBody.errors).toContain("Failed to create room");

});

test('negative: should fail without authorization', async ({ request }) => {
    const createRoomRequestBody = { ...createRoomBody, roomName: `NoAuth_${Date.now()}` };
    const response = await createRoomHelper(request, '', createRoomRequestBody);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.status()).toBe(500);
    expect(responseBody.errors).toContain("An unexpected error occurred");
});

test('negative: should fail with non existing type', async ({ request }) => {
    const createRoomRequestBody = { ...createRoomBody, type: 'Luxury' };
    const response = await createRoomHelper(request, adminToken, createRoomRequestBody);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.status()).toBe(400);
    expect(responseBody.errors).toContain("Type can only contain the room options Single, Double, Twin, Family or Suite");

});

test('negative: should fail with empty type', async ({ request }) => {
    const createRoomRequestBody = { ...createRoomBody, type: '' };
    const response = await createRoomHelper(request, adminToken, createRoomRequestBody);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.status()).toBe(400);
    expect(responseBody.errors).toContain("Type can only contain the room options Single, Double, Twin, Family or Suite");

});

test('negative: should reject non-boolean value for accessible field', async ({ request }) => {
    const createRoomRequestBody = { ...createRoomBody, accessible: 'yes' };
    const response = await createRoomHelper(request, adminToken, createRoomRequestBody);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.status()).toBe(400);
    expect(responseBody.errors).toContain("Failed to create room");

});

test('negative: features — not list ', async ({ request }) => {
    const createRoomRequestBody = { ...createRoomBody, features: 'WiFi,TV' };
    const response = await createRoomHelper(request, adminToken, createRoomRequestBody);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.status()).toBe(500);
    expect(responseBody.errors).toContain("Failed to create room");
});

test('negative: features — contains an invalid value', async ({ request }) => {
    const createRoomRequestBody = { ...createRoomBody, features: ['WiFi1', true, 'Pool',] };
    const response = await createRoomHelper(request, adminToken, createRoomRequestBody);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.status()).toBe(400);
    expect(responseBody.errors).toContain("Failed to create room");
});