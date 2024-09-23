/*
  Warnings:

  - Added the required column `nama_pelanggan` to the `Keranjang` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama_pelanggan` to the `Transaksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Keranjang" ADD COLUMN     "nama_pelanggan" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaksi" ADD COLUMN     "nama_pelanggan" TEXT NOT NULL;
