/*
  Warnings:

  - You are about to drop the column `provierTransactionId` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "provierTransactionId",
ADD COLUMN     "providerTransactionId" TEXT;
