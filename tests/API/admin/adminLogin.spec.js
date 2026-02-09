import { faker } from '@faker-js/faker';
import {test, expect} from '@playwright/test';
import {USERS} from "../../../resources/constants/userCredentials";
import {adminAuthenticationHelper} from "../../../helpers/adminAuthHelper";
import {adminAuthenticationBody} from "../../../helpers/payloads/adminAuthenticationBody";

test.describe('Admin Login', () => {
    test('should successfully login as admin and receive token', async ({request}) => {
        const adminAuthRequestBody = adminAuthenticationBody(USERS.ADMIN);
        const response = await adminAuthenticationHelper(request, adminAuthRequestBody);

        expect(response.status(), 'The status should be 200').toBe(200);
        const responseBody = await response.json();
        expect(responseBody, 'The response must contain a token').toHaveProperty('token');
    });
    test('Try to login with wrong credentials', async ({request}) => {
        const adminAuthRequestBody = adminAuthenticationBody(USERS.ADMIN);
        adminAuthRequestBody.username = faker.internet.username();
        adminAuthRequestBody.password = faker.number.int();
        const response = await adminAuthenticationHelper(request, adminAuthRequestBody);

        expect(response.status(), 'The status should be 401').toBe(401);
    })
});