/*
  Warnings:

  - You are about to drop the column `id_menu` on the `Keranjang` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Keranjang` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Keranjang" DROP CONSTRAINT "Keranjang_id_menu_fkey";

-- AlterTable
ALTER TABLE "Keranjang" DROP COLUMN "id_menu",
DROP COLUMN "quantity";
