/*
  Warnings:

  - A unique constraint covering the columns `[providerAccountId]` on the table `ThirdParty` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ThirdParty" ALTER COLUMN "provider" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "ThirdParty_providerAccountId_key" ON "ThirdParty"("providerAccountId");
