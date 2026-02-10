import {expect, test} from "@playwright/test";
import {bookRoomHelper} from "../../../helpers/bookRoomHelper";
import {createRoomRequest} from "../../../flows/createRoomFlow";
import {bookRoomBody} from "../../../helpers/payloads/bookRoomBody";

test('Book Room', async ({request}) => {
    const bookRoomRequestBody = bookRoomBody;
    const response = await bookRoomHelper(request, bookRoomRequestBody)

    expect(response.status()).toBe(201);

    const responseBody = await response.json();

    expect(responseBody.roomid).toBe(bookRoomRequestBody.roomid);
    expect(responseBody.firstname).toBe(bookRoomRequestBody.firstname);
    expect(responseBody.lastname).toBe(bookRoomRequestBody.lastname);
    expect(responseBody.depositpaid).toBe(bookRoomRequestBody.depositpaid);
    expect(responseBody.bookingdates.checkin).toBe(bookRoomRequestBody.bookingdates.checkin);
    expect(responseBody.bookingdates.checkout).toBe(bookRoomRequestBody.bookingdates.checkout);
});


test('try to book room with invalid roomid', async ({ request }) => {
    const bodyWithInvalidRoomID = {
        ...bookRoomBody,
        roomid: '0'
    };
    const  response  = await bookRoomHelper(request, bodyWithInvalidRoomID);
    const responseBody = await response.json();
    expect(response.status()).toBe(400);
    expect(responseBody.errors[0]).toBe('must be greater than or equal to 1');
});

test('try to book room when checkout is before checkin', async ({ request }) => {
    const bodyWithWrondDates = {
        ...bookRoomBody,
        bookingdates: {
            checkin: '2026-02-10',
            checkout: '2025-02-09'
        }
    };
    const  response  = await bookRoomHelper(request, bodyWithWrondDates);
    const responseBody = await response.json();
    expect(response.status()).toBe(409);
    expect(responseBody.error).toContain('Failed to create booking');
});

test('try to book room with checkin in the past', async ({ request }) => {
    const bodyWithWrondDates = {
        ...bookRoomBody,
        bookingdates: {
            checkin: '2020-01-01',
            checkout: '2026-02-10'
        }
    };
    const  response  = await bookRoomHelper(request, bodyWithWrondDates);
    const responseBody = await response.json();
    expect(response.status()).toBe(409);
    expect(responseBody.error).toContain('Failed to create booking');
});

test('try to book room without firstname', async ({ request }) => {
    const bodyWithoutFirstName = {
        ...bookRoomBody,
        firstname: ''
    };
    const  response  = await bookRoomHelper(request, bodyWithoutFirstName);
    const responseBody = await response.json();
    expect(response.status()).toBe(400);
    expect(responseBody.errors).toContain('Firstname should not be blank');
    expect(responseBody.errors).toContain('size must be between 3 and 18');
});

test('try to book room with empty lastname', async ({ request }) => {
    const bodyWithoutLastName = {
        ...bookRoomBody,
        firstname: ''
    };
    const  response  = await bookRoomHelper(request, bodyWithoutLastName);
    const responseBody = await response.json();
    expect(response.status()).toBe(400);
    expect(responseBody.errors).toContain('Firstname should not be blank');
    expect(responseBody.errors).toContain('size must be between 3 and 18');
});

test('try to book room with invalid depositpaid type', async ({ request }) => {
    const bodyWithIvalidType = {
        ...bookRoomBody,
        depositpaid: 'anyTextExpectTrueFalse'
    };
    const  response  = await bookRoomHelper(request, bodyWithIvalidType);
    const responseBody = await response.json();
    expect(response.status()).toBe(400);
    expect(responseBody.errors[0]).toContain('Failed to create booking');
});

test('try to book same room twice with same date', async ({ request }) => {
    const createRoom = await createRoomRequest(request);
    const sameRoomAndDates = {
        ...bookRoomBody,
        roomid: createRoom.requestBody.roomName,
        bookingdates: {
            checkin: '2026-03-01',
            checkout: '2026-04-10'
        }
    };
    const bookRoomResponse = await bookRoomHelper(request, sameRoomAndDates);
    expect(bookRoomResponse.status()).toBe(201);
    const bookSameRoomWithSameCheckoutDatesResponse = await bookRoomHelper(request, sameRoomAndDates);
    expect(bookSameRoomWithSameCheckoutDatesResponse.status()).toBe(409);
});
