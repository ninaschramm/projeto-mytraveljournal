import faker from "@faker-js/faker";
import { Prisma, Posts } from "@prisma/client";
import { client } from '../../prisma/prisma';

export async function createPost(tripId: number): Promise<Posts> {
    const data: Prisma.PostsUncheckedCreateInput = {
        tripId,
        text: faker.lorem.paragraph(),
        image: faker.internet.url(),
      }
    return client.posts.create({
    data
  });
}
