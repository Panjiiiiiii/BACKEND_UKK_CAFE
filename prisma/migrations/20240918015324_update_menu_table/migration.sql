/*
  Warnings:

  - Added the required column `jenis` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `nama_menu` on the `Menu` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "jenis" "jenis_menu" NOT NULL,
DROP COLUMN "nama_menu",
ADD COLUMN     "nama_menu" TEXT NOT NULL;
