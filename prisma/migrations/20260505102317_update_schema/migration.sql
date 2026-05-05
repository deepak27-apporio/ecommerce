/*
  Warnings:

  - Added the required column `productCategory` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productImages` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "productCategory" TEXT NOT NULL,
ADD COLUMN     "productImages" TEXT NOT NULL;
