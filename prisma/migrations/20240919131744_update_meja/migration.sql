-- CreateEnum
CREATE TYPE "statusMeja" AS ENUM ('direservasi', 'belum_direservasi');

-- AlterTable
ALTER TABLE "Meja" ADD COLUMN     "status_meja" "statusMeja" NOT NULL DEFAULT 'belum_direservasi';
