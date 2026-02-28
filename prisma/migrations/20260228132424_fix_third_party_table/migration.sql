/*
  Warnings:

  - The primary key for the `ThirdParty` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ThirdParty` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ThirdParty_userId_provider_key";

-- AlterTable
ALTER TABLE "ThirdParty" DROP CONSTRAINT "ThirdParty_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ThirdParty_pkey" PRIMARY KEY ("userId");
