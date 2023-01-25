import { Prisma } from '@prisma/client';
import { client } from '../../prisma/prisma'

async function getReservationsByTrip(tripId: number) {
    const result = await client.reservations.findMany({
        where:
         { 
            tripId,
         }
    });
    
    return result;
}

async function addNewReservation(data: Prisma.ReservationsUncheckedCreateInput) {
    const reservation = await client.reservations.create({
        data
    });

    return reservation;
}

async function removeReservation(reservationId: number) {
    const reservation = await client.reservations.delete({
        where: {
            id: reservationId
        }
    });

    return reservation;
}

const reservationsRepository = {
    getReservationsByTrip,
    addNewReservation,
    removeReservation,
}

export default reservationsRepository;