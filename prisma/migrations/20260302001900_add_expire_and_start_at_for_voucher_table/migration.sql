/*
  Warnings:

  - Added the required column `expireAt` to the `Voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startAt` to the `Voucher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Voucher" ADD COLUMN     "expireAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL;
