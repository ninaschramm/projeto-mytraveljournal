import reservationsRepository from "repositories/reservationsRepository";
import tripsRepository from "repositories/tripsRepository";
import { notFoundError } from "utils/errorUtils";

async function getReservationsByTrip(userId: number, tripId: number) {

    const permission = await tripsRepository.verifyUserToTrip(userId, tripId);
    if (!permission) {
        throw notFoundError("Sorry, it looks like we couldn't find this trip for you");
    }

    const result = await reservationsRepository.getReservationsByTrip(tripId);
    return result
}

const reservationsServices = {
    getReservationsByTrip,
}

export default reservationsServices;