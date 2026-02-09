import {API_BASE_URL} from "../resources/environment";

async function adminAuthenticationHelper(request, authenticationBody) {
    return await request.post(`${API_BASE_URL}/auth/login`, {
        headers: {
            'accept': '*/*',
            'content-type': 'application/json',
        },
        data: authenticationBody
    });
}

export {adminAuthenticationHelper};