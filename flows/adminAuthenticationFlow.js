import {expect} from "@playwright/test";
import {USERS} from "../resources/constants/userCredentials";
import {adminAuthenticationHelper} from "../helpers/adminAuthHelper";
import {adminAuthenticationBody} from "../helpers/payloads/adminAuthenticationBody";

let adminToken;

async function authenticationAdmin(request) {
    const requestBody = adminAuthenticationBody(USERS.ADMIN)
    const response = await adminAuthenticationHelper(request, requestBody);
    expect(response.status(), "ADMIN AUTH FAILED").toBe(200);
    const responseBody = await response.json();
    adminToken = responseBody.token;
}

export  const getAdminToken = async (request)=>{
    if(!adminToken){
       await authenticationAdmin(request);
    }
    return adminToken
}