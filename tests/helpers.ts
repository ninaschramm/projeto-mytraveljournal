import * as jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { createUser } from "./factories/usersFactory";
import { client } from "../prisma/prisma";

export async function cleanDb() {
  await client.posts.deleteMany({});
  await client.reservations.deleteMany({});
  await client.trips.deleteMany({});
  await client.user.deleteMany({});
}

export async function generateValidToken(user?: User) {
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

  return token;
}
