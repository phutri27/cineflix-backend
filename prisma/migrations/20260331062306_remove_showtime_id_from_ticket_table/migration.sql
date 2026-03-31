/*
  Warnings:

  - You are about to drop the column `showtimeId` on the `Ticket` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_showtimeId_fkey";

-- DropIndex
DROP INDEX "Ticket_showtimeId_seatId_key";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "showtimeId";
