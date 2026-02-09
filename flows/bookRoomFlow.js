import {expect} from "@playwright/test";
import {bookRoomHelper} from "../helpers/bookRoomHelper";
import {bookRoomBody} from "../helpers/payloads/bookRoomBody";

export async function bookRoomRequest(request) {
    const requestBody =  bookRoomBody;
    const response = await bookRoomHelper(request, requestBody);
    const responseBody = await response.json();
    expect(response.status(), `BOOKING FAILED ${JSON.stringify(requestBody)} |||| /n ${JSON.stringify(responseBody)}`)
        .toBe(200);
    return {response, responseBody, requestBody};
}