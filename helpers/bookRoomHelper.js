import {API_BASE_URL} from "../resources/environment";

const bookRoomHelper = async (request, body) => {
    return await request.post(`${API_BASE_URL}/booking`, {
        headers: {
            'accept': '*/*',
            'content-type': 'application/json',


        },
        data: body
    });
};

export {bookRoomHelper};