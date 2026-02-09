import {API_BASE_URL} from "../resources/environment";

const createRoomHelper = async (request, token, body) => {
    return await request.post(`${API_BASE_URL}/room`, {
        headers: {
            'accept': '*/*',
            'content-type': 'application/json',
            'Cookie': `token=${token}`,
        },
        data: body
    });
};

export {createRoomHelper};