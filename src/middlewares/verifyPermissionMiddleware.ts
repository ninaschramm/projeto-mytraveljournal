import tripsRepository from "repositories/tripsRepository";
import { notFoundError } from "utils/errorUtils";

export async function verifyPermission(userId: number, tripId: number) {
    const permission = await tripsRepository.verifyUserToTrip(userId, tripId);
    if (!permission) {
        throw notFoundError("Sorry, it looks like we couldn't find this trip for you");
    };
    return permission
}