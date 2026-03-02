/*
  Warnings:

  - A unique constraint covering the columns `[activationCode]` on the table `Voucher` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Voucher_activationCode_key" ON "Voucher"("activationCode");
