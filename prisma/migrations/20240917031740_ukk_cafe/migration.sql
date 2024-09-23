-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'KASIR', 'MANAJER');

-- CreateEnum
CREATE TYPE "jenis_menu" AS ENUM ('MAKANAN', 'MINUMAN');

-- CreateEnum
CREATE TYPE "status" AS ENUM ('belum_bayar', 'lunas', 'batal');

-- CreateTable
CREATE TABLE "User" (
    "id_user" SERIAL NOT NULL,
    "nama_user" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id_menu" SERIAL NOT NULL,
    "nama_menu" "jenis_menu" NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "gambar" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id_menu")
);

-- CreateTable
CREATE TABLE "Meja" (
    "id_meja" SERIAL NOT NULL,
    "nomor_meja" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meja_pkey" PRIMARY KEY ("id_meja")
);

-- CreateTable
CREATE TABLE "Transaksi" (
    "id_transaksi" SERIAL NOT NULL,
    "tgl_transaksi" TIMESTAMP(3) NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_meja" INTEGER NOT NULL,
    "status" "status" NOT NULL DEFAULT 'belum_bayar',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaksi_pkey" PRIMARY KEY ("id_transaksi")
);

-- CreateTable
CREATE TABLE "Detail_transaksi" (
    "id_detail_transaksi" SERIAL NOT NULL,
    "id_transaksi" INTEGER NOT NULL,
    "total_harga" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Detail_transaksi_pkey" PRIMARY KEY ("id_detail_transaksi")
);

-- CreateTable
CREATE TABLE "Keranjang" (
    "id_cart" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_menu" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "total_harga" INTEGER NOT NULL,
    "check_out" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Keranjang_pkey" PRIMARY KEY ("id_cart")
);

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_id_meja_fkey" FOREIGN KEY ("id_meja") REFERENCES "Meja"("id_meja") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detail_transaksi" ADD CONSTRAINT "Detail_transaksi_id_transaksi_fkey" FOREIGN KEY ("id_transaksi") REFERENCES "Transaksi"("id_transaksi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keranjang" ADD CONSTRAINT "Keranjang_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keranjang" ADD CONSTRAINT "Keranjang_id_menu_fkey" FOREIGN KEY ("id_menu") REFERENCES "Menu"("id_menu") ON DELETE RESTRICT ON UPDATE CASCADE;
