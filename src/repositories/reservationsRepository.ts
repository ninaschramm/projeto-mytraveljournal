import { Prisma } from '@prisma/client';
import { client } from '../../prisma/prisma'

async function getReservationsByTrip(tripId: number) {
    const result = await client.reservations.findMany({
        where:
         { 
            tripId,
         }
    })   
    
    return result;
}

const reservationsRepository = {
    getReservationsByTrip,
}

export default reservationsRepository;