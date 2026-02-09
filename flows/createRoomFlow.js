import {expect} from "@playwright/test";
import {getAdminToken} from "./adminAuthenticationFlow";
import {createRoomHelper} from "../helpers/createRoomHelper";
import {createRoomBody} from "../helpers/payloads/createRoomBody";

export async function createRoomRequest(request) {
    const requestBody = createRoomBody;
    const response = await createRoomHelper(request, await getAdminToken(request), requestBody);
    expect(response.ok(), `FAILED TO CREATE ROOM ${requestBody}`).toBeTruthy()
    const responseBody = await response.json();
    return {response, responseBody, requestBody};
}