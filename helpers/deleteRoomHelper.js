import {API_BASE_URL} from "../resources/environment";

async function deleteRoomRequest(request, token, roomId) {
    return await request.delete(`${API_BASE_URL}/room/${roomId}`, {
        headers: {
            'accept': '*/*',
            'content-type': 'application/json',
            'Cookie': `token=${token}`,
        }
    });
}

export {deleteRoomRequest};