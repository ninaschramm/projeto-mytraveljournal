import faker from "@faker-js/faker";
import { Prisma, Reservations } from "@prisma/client";
import { client } from '../../prisma/prisma';

export async function createReservation(tripId: number): Promise<Reservations> {
    const data: Prisma.ReservationsUncheckedCreateInput = {
        tripId,
        title: faker.word.noun(),
        code: faker.internet.password(8),
        type: "Transport"
      }
    return client.reservations.create({
    data
  });
}
