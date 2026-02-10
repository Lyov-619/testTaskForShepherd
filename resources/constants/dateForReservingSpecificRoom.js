import { faker } from '@faker-js/faker';

const bookingDate = new Date();

const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const maxDays = Math.min(1, new Date(bookingDate.getFullYear(), bookingDate.getMonth() + 1, 0).getDate() - bookingDate.getDate());
const checkout = new Date(bookingDate);
checkout.setDate(bookingDate.getDate() + faker.number.int({ min: 1, max: maxDays }));

const DATE_FOR_RESERVING_ROOM = {
    DATE:{
        checkin: formatDateLocal(bookingDate),
        checkout: formatDateLocal(checkout)
    }
}

export {DATE_FOR_RESERVING_ROOM}