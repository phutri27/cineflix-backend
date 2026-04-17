/*
  Warnings:

  - The primary key for the `ProfileVoucher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProfileVoucher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProfileVoucher" DROP CONSTRAINT "ProfileVoucher_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ProfileVoucher_pkey" PRIMARY KEY ("userId", "voucherId");
