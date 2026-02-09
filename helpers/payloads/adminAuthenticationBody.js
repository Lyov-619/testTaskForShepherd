import {USERS} from "../../resources/constants/userCredentials";

const adminAuthenticationBody = (user = USERS.ADMIN) => {
    return {
        username: user.username,
        password: user.password
    };
}
export {adminAuthenticationBody};