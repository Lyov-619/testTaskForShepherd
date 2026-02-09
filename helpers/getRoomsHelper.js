import {API_BASE_URL} from '../resources/environment';

const getRoomsHelper = async (request, token) => {
    return await request.get(`${API_BASE_URL}/room`, {
        headers: {
            'accept': '*/*',
            'content-type': 'application/json',
            'Cookie': `token=${token}`,
        }
    });
};

export {getRoomsHelper};