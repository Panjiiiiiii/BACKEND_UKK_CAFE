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
