/*
  Warnings:

  - The primary key for the `ThirdParty` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,provider]` on the table `ThirdParty` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `ThirdParty` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "ThirdParty" DROP CONSTRAINT "ThirdParty_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "ThirdParty_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "ThirdParty_userId_provider_key" ON "ThirdParty"("userId", "provider");
