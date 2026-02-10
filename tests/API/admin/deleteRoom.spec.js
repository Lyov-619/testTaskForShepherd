import {expect, test} from "@playwright/test";
import {getRoomsRequest} from "../../../flows/getRoomsFlow";
import {createRoomHelper} from "../../../helpers/createRoomHelper";
import {deleteRoomRequest} from "../../../helpers/deleteRoomHelper";
import {getAdminToken} from "../../../flows/adminAuthenticationFlow";
import {createRoomBody} from "../../../helpers/payloads/createRoomBody";

test("should delete Room by roomid", async ({request}) => {
    const adminToken = await getAdminToken(request);
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