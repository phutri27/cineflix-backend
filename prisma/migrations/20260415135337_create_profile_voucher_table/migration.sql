-- CreateTable
CREATE TABLE "ProfileVoucher" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "voucherId" TEXT NOT NULL,
    "redeemed" BOOLEAN NOT NULL DEFAULT false,
    "redeemedAt" TIMESTAMP(3),
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ProfileVoucher_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProfileVoucher" ADD CONSTRAINT "ProfileVoucher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileVoucher" ADD CONSTRAINT "ProfileVoucher_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "Voucher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
