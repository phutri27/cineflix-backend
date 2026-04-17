/*
  Warnings:

  - You are about to drop the column `redeemed` on the `ProfileVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `redeemedAt` on the `ProfileVoucher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProfileVoucher" DROP COLUMN "redeemed",
DROP COLUMN "redeemedAt";
