import { PrismaClient } from "@prisma/client";

export let client: PrismaClient;

export function connectDb(): void {
    client = new PrismaClient();
  }
  
  export async function disconnectDb(): Promise<void> {
    await client?.$disconnect();
  }
  