import tripsRepository from "repositories/tripsRepository";
import { impossibleDateError, notFoundError, unauthorizedError, wrongSchemaError } from "utils/errorUtils";

async function getTripsByUser(userId: number) {
    const result = await tripsRepository.getTripsByUser(userId);
    return result
}

async function addNewTrip(userId: number, title: string, startDate: string, endDate: string) {

    if (!title || !startDate || !endDate) {
        throw wrongSchemaError("Looks like something is missing");
    }

    if (Date.parse(endDate) < Date.parse(startDate)) {
        throw impossibleDateError();
    }

    const startsAt = new Date(startDate);
    const endsAt = new Date(endDate);

    const data = {
        title,
        userId,
        startsAt,
        endsAt
      };

    const trip = await tripsRepository.addNewTrip(data)
}

async function removeTrip(userId: number, tripId: number) {

    const permission = await tripsRepository.verifyUserToTrip(userId, tripId);
    if (!permission) {
        throw notFoundError("Sorry, it looks like we couldn't find this trip for you");
    }

    const trip = await tripsRepository.removeTrip(tripId);
    return trip;
}

const tripsServices = {
    getTripsByUser,
    addNewTrip,
    removeTrip
}

export default tripsServices;