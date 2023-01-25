/*
  Warnings:

  - Added the required column `endsAt` to the `Trips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startsAt` to the `Trips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Trips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trips" ADD COLUMN     "endsAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startsAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "title" VARCHAR(255) NOT NULL;
