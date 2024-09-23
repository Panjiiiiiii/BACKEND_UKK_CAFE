-- CreateTable
CREATE TABLE "KeranjangMenu" (
    "id_cart" INTEGER NOT NULL,
    "id_menu" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "KeranjangMenu_pkey" PRIMARY KEY ("id_cart","id_menu")
);

-- AddForeignKey
ALTER TABLE "KeranjangMenu" ADD CONSTRAINT "KeranjangMenu_id_cart_fkey" FOREIGN KEY ("id_cart") REFERENCES "Keranjang"("id_cart") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeranjangMenu" ADD CONSTRAINT "KeranjangMenu_id_menu_fkey" FOREIGN KEY ("id_menu") REFERENCES "Menu"("id_menu") ON DELETE RESTRICT ON UPDATE CASCADE;
