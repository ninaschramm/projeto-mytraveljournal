import tripsRepository from "repositories/tripsRepository";

async function getTripsByUser(userId: number) {
    const result = await tripsRepository.getTripsByUser(userId);
    return result
}

const tripsServices = {
    getTripsByUser,
}

export default tripsServices;