import {faker} from '@faker-js/faker';
import {ROOM_TYPES} from "../../resources/constants/roomTypes";
import {ROOM_FEATURES} from "../../resources/constants/roomFeatures";

const roomName = faker.number.int({min: 100, max: 800}).toString();
const type = faker.helpers.arrayElement(Object.values(ROOM_TYPES));
const accessible = faker.datatype.boolean();
const roomPrice = faker.number.int({min: 50, max: 250}).toString();
const features = faker.helpers.arrayElements(Object.values(ROOM_FEATURES), {
    min: 1,
    max: Object.keys(ROOM_FEATURES).length
});

const createRoomBody = {
    roomName,
    type,
    accessible,
    roomPrice,
    features,
};

export {createRoomBody};
