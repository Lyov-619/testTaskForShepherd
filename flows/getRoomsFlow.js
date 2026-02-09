import {getAdminToken} from "./adminAuthenticationFlow";
import {getRoomsHelper} from "../helpers/getRoomsHelper";
import {expect} from "@playwright/test";

export async function getRoomsRequest(request) {
    const response = await getRoomsHelper(request, getAdminToken());
    expect(response.ok(), "FAILED TO GET ROOMS").toBeTruthy()
    const responseBody = await response.json();
    return {response, responseBody};

}