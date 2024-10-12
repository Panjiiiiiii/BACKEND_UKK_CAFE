const { PrismaClient } = require("@prisma/client");
const { dateSchema } = require("../schema/order");

const prisma = new PrismaClient({
  log: ["query"],
});

exports.getOrder = async (req, res) => {
  try {
    const order = await prisma.transaksi.findMany({
      include: {
        meja: true,
        user: true,
        Detail_transaksi: true,
      },
    });
    if (order) {
      return res.json({
        status: "Success",
        data: order,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: "Fail",
      error: error,
    });
  }
};

exports.createOrder = async (req, res) => {
  try {
    return await prisma.$transaction(async (tx) => {
      // Check cart items
      const cart = await tx.keranjang.findMany({
        where: {
          id_user: req.user.id_user,
          id_cart: +req.params.id,
        },
        include: {
          KeranjangMenu: {
            include: {
              menu: true,
            },
          },
        },
      });

      if (cart.length == 0) {
        return res.json({
          message: "Cart is empty",
        });
      }

      const totalPrice = cart.reduce((prev, currentCart) => {
        const cartTotal = currentCart.KeranjangMenu.reduce(
          (subtotal, cartMenuItem) => {
            return subtotal + cartMenuItem.quantity * cartMenuItem.menu.harga;
          },
          0
        );
        return prev + cartTotal;
      }, 0);

      console.log(totalPrice);

      for (const menuItem of cart) {
        // Create new order
        const newOrder = await tx.transaksi.create({
          data: {
            tgl_transaksi: new Date(),
            id_user: req.user.id_user,
            id_meja: menuItem.id_meja,
            nama_pelanggan: menuItem.nama_pelanggan,
            status: "belum_bayar",
          },
        });

        // Create transaction details
        const newDetail = await tx.detail_transaksi.create({
          data: {
            id_transaksi: newOrder.id_transaksi,
            total_harga: totalPrice,
          },
        });

        // Hapus item di keranjang
        await tx.keranjangMenu.deleteMany({
          where: {
            id_cart: menuItem.id_cart, // Menggunakan menuItem.id_cart
          },
        });

        // Hapus keranjang
        await tx.keranjang.delete({
          where: {
            id_cart: menuItem.id_cart, // Menggunakan menuItem.id_cart
          },
        });
      }

      return res.json({
        status: "Success",
        message: "Order has been created and cart has been cleared",
      });
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "Fail",
      error: error.message,
    });
  }
};

//Create struk
exports.createStruk = async (req, res) => {
  try {
    const transaksi = await prisma.transaksi.findUnique({
      where: {
        id_transaksi: +req.params.id,
      },
      include: {
        Detail_transaksi: true,
        meja: true,
        user: true,
      },
    });
    console.log(transaksi);

    if (!transaksi) {
      return res.json({
        status: "Fail",
        error: "Transaksi no found",
      });
    }

    const keranjang = await prisma.keranjang.findFirst({
      where: {
        id_user: transaksi.id_user,
        id_meja: transaksi.id_meja,
      },
      include: {
        KeranjangMenu: {
          include: {
            menu: true,
          },
        },
      },
    });
    console.log(keranjang);

    if (!keranjang) {
      return res.json({
        status: "Fail",
        error: "Keranjang no found",
      });
    }

    let totalHarga = 0;
    const items = keranjang.KeranjangMenu.map((item) => {
      const totalHargaItem = item.menu.harga * item.quantity;
      totalHarga += totalHargaItem;
      return {
        nama_menu: item.menu.nama_menu,
        quantity: item.quantity,
        harga_menu: item.menu.harga,
        total_harga: totalHargaItem,
      };
    });

    const struk = {
      id_transaksi: transaksi.id_transaksi,
      nama_pelanggan: transaksi.nama_pelanggan,
      tgl_transaksi: transaksi.tgl_transaksi,
      meja: transaksi.meja.nomor_meja,
      items: items,
      total_harga: totalHarga,
    };

    return res.json({
      status: "Success",
      data: struk,
      message: "Items have been added to the cart",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "Fail",
      error: error,
    });
  }
};

//delete cart if status : dibayar
exports.changeStatus = async (req, res) => {
  try {
    const transaksi = await prisma.transaksi.findUnique({
      where: {
        id_transaksi: +req.params.id,
      },
    });
    console.log(transaksi);
    if (!transaksi) {
      return res.json({
        status: "Fail",
        code: 404,
        message: "Transaksi not found",
      });
    }

    const updateData = await prisma.transaksi.update({
      where: {
        id_transaksi: +req.params.id,
      },
      data: {
        status: req.body.status,
      },
    });

    const keranjang = await prisma.keranjang.findFirst({
      where: {
        id_user: transaksi.id_user,
        id_meja: transaksi.id_meja,
      },
    });
    console.log(keranjang);

    if (!keranjang) {
      return res.json({
        status: "Fail",
        code: 404,
        message: "Cart not found",
      });
    }
    return res.json({
      status: "Success",
      data: updateData,
      message: "Data transaksi has been updated",
    });
  } catch (error) {
    return res.json({
      status: "Fail",
      error: error,
    });
  }
};

//sorting order by date
exports.getTransaksiByDate = async (req, res) => {
  try {
    const validatedData = dateSchema.safeParse(req.query);
    const start = new Date(validatedData.data.startDate);
    const end = new Date(validatedData.data.endDate);
    const sortBy = validatedData.data.order === "asc" ? "asc" : "desc";
    const transaksiList = await prisma.transaksi.findMany({
      where: {
        tgl_transaksi: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        tgl_transaksi: sortBy,
      },
    });
    console.log(transaksiList);
    return res.json({
      status: "Success",
      data: transaksiList,
      message: "Datas have been loaded",
    });
  } catch (error) {
    return res.json({
      status: "Fail",
      error: error,
    });
  }
};
// get data order by user
exports.getDatabyUser = async (req, res) => {
  try {
    const dataByUser = await prisma.transaksi.findMany({
      where: {
        id_user: +req.params.id,
      },
      include: {
        Detail_transaksi: true,
        meja: true,
        user: true,
      },
    });

    if (dataByUser.length == 0) {
      return res.json({
        message: "Empty transaction",
      });
    }

    return res.json({
      status: "Success",
      data: dataByUser,
      message: "Datas have been loaded",
    });
  } catch (error) {
    return res.json({
      status: "Fail",
      error: error,
    });
  }
};
