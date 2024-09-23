/*
  Warnings:

  - You are about to drop the column `status_meja` on the `Meja` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Meja" DROP COLUMN "status_meja";

-- DropEnum
DROP TYPE "statusMeja";
