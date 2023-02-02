import { ReservationType } from "@prisma/client";
import reservationsRepository from "repositories/reservationsRepository";
import tripsRepository from "repositories/tripsRepository";
import { notFoundError } from "utils/errorUtils";
import { verifySchema } from "middlewares/validateSchemasMiddleware";

async function getReservationsByTrip(userId: number, tripId: number) {

    await verifyPermission(userId, tripId);

    const result = await reservationsRepository.getReservationsByTrip(tripId);
    return result;
}

async function addNewReservation(userId: number, tripId: number, code: string, type: ReservationType, title: string) {

    verifySchema(title, code, type);
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

async function removeReservation(userId: number, tripId: number, reservationId: number) {

    await verifyPermission(userId, tripId);

    const reservation = await reservationsRepository.removeReservation(reservationId);
    return reservation;
}

async function verifyPermission(userId: number, tripId: number) {
    const permission = await tripsRepository.verifyUserToTrip(userId, tripId);
    if (!permission) {
        throw notFoundError("Sorry, it looks like we couldn't find this trip for you");
    };
    return permission
}

const reservationsServices = {
    getReservationsByTrip,
    addNewReservation,
    removeReservation,
}

export default reservationsServices;