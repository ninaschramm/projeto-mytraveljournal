import faker from "@faker-js/faker";
import { Prisma, Trips } from "@prisma/client";
import { client } from '../../prisma/prisma';
import dayjs from "dayjs";

export async function createTrip(userId: number): Promise<Trips> {
    const startDate = new Date (dayjs(faker.date.future()).format('YYYY-MM-DD'))
    const endDate = new Date (dayjs(startDate).add(7, 'day').format('YYYY-MM-DD'))
    const data: Prisma.TripsUncheckedCreateInput = {
        userId,
        title: faker.word.noun(),
        startsAt: startDate,
        endsAt: endDate
      }
    return client.trips.create({
    data
  });
}
