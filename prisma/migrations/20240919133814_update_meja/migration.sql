/*
  Warnings:

  - Added the required column `id_meja` to the `Keranjang` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Keranjang" ADD COLUMN     "id_meja" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Keranjang" ADD CONSTRAINT "Keranjang_id_meja_fkey" FOREIGN KEY ("id_meja") REFERENCES "Meja"("id_meja") ON DELETE RESTRICT ON UPDATE CASCADE;
