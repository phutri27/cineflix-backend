/*
  Warnings:

  - Added the required column `address` to the `Cinema` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hotline` to the `Cinema` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cinema" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "hotline" TEXT NOT NULL;
