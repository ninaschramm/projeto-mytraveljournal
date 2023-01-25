-- CreateEnum
CREATE TYPE "ReservationType" AS ENUM ('Hotel', 'Transport', 'Ticket', 'Other');

-- CreateTable
CREATE TABLE "Reservations" (
    "id" SERIAL NOT NULL,
    "tripId" INTEGER NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "type" "ReservationType" NOT NULL,
    "title" VARCHAR(255) NOT NULL,

    CONSTRAINT "Reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Posts" (
    "id" SERIAL NOT NULL,
    "tripId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image" TEXT NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reservations" ADD CONSTRAINT "Reservations_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
