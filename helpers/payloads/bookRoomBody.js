import { faker } from '@faker-js/faker';

const bookingDate = new Date();
bookingDate.setFullYear(bookingDate.getFullYear()+faker.number.int({min:1, max:100}));

const formatDateLocal = (date) => {
    const year = date.getFullYear()+1;
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const checkout = new Date(bookingDate);
checkout.setDate(bookingDate.getDate() + faker.number.int({ min: 1, max: 3 }));

const bookingDates = {
    checkin: formatDateLocal(bookingDate),
    checkout: formatDateLocal(checkout)
}

const bookRoomBody = {
    roomid: faker.number.int({ min: 1, max: 10 }),
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    depositpaid: true,
    bookingdates: bookingDates,
    email: faker.internet.email(),
    phone: `+37498${faker.string.numeric(6)}`
}

export {bookRoomBody};