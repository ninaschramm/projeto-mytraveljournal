import { ReservationType } from "@prisma/client";
import reservationsRepository from "repositories/reservationsRepository";
import tripsRepository from "repositories/tripsRepository";
import { notFoundError, wrongSchemaError } from "utils/errorUtils";

async function getReservationsByTrip(userId: number, tripId: number) {

    await verifyPermission(userId, tripId);

    const result = await reservationsRepository.getReservationsByTrip(tripId);
    return result;
}

async function addNewReservation(userId: number, tripId: number, code: string, type: ReservationType, title: string) {

    if (!title || !code || !type) {
        throw wrongSchemaError("Looks like something is missing");
    };

    await verifyPermission(userId, tripId);

    const data = {
        tripId,
        code,
        type,
        title
    }

    const reservation = await reservationsRepository.addNewReservation(data);
    return reservation;
}

async function verifyPermission(userId: number, tripId: number) {
    const permission = await tripsRepository.verifyUserToTrip(userId, tripId);
    if (!permission) {
        throw notFoundError("Sorry, it looks like we couldn't find this trip for you");
    };
    return permission
}

// function verifySchema(...args) {
//     args.map((e) =>
//     {
//         if (!e) {
//             throw wrongSchemaError("Looks like something is missing");
//         }
//     })
// }

const reservationsServices = {
    getReservationsByTrip,
    addNewReservation
}

export default reservationsServices;