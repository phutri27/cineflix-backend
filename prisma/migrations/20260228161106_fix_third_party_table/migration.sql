/*
  Warnings:

  - A unique constraint covering the columns `[providerAccountId,provider]` on the table `ThirdParty` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ThirdParty_userId_provider_key";

-- CreateIndex
CREATE UNIQUE INDEX "ThirdParty_providerAccountId_provider_key" ON "ThirdParty"("providerAccountId", "provider");
