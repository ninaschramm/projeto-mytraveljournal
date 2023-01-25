import { Prisma } from '@prisma/client';
import { client } from '../../prisma/prisma'

async function getTripsByUser(userId: number) {
    const result = await client.trips.findMany({
        where:
         { 
            userId,
         }
    })   
    
    return result;
}

async function addNewTrip(data: Prisma.TripsUncheckedCreateInput) {
    const trip = await client.trips.create({
        data
      });

    return trip;
}

async function removeTrip(tripId: number) {
    const trip = await client.trips.delete({
        where: {
            id: tripId
        }
    });

    return trip;
}

async function verifyUserToTrip(userId: number, tripId: number) {
    const permission = await client.trips.findFirst({
        where: {
            id: tripId,
            userId,
        }
    })

    return permission;
}

const tripsRepository = {
    getTripsByUser,
    addNewTrip,
    removeTrip,
    verifyUserToTrip
  };
  
  export default tripsRepository;