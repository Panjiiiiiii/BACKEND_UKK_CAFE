const { PrismaClient } = require("@prisma/client");
const { changeQuantitySchema } = require("../schema/cart");

const prisma = new PrismaClient({
  log: ["query"],
});

exports.addItemCart = async (req, res) => {
  try {

    const availableMeja = await prisma.meja.findFirst({
      where: {
        id_meja: +req.body.id_meja, 
      },
    });

    if (!availableMeja) {
      return res.json({
        status: "Fail",
        code : 404,
        message: "Meja not found",
      });
    }

    // Get the customer name from the request
    const nama_pelanggan = req.body.nama_pelanggan;

    if (!nama_pelanggan) {
      return res.json({
        status: "Fail",
        message: "Nama pelanggan is required",
      });
    }

    let cart = await prisma.keranjang.findFirst({
      where: {
        id_user: req.user.id_user,
        id_meja: +req.body.id_meja,
      },
    });

    if (!cart) {
      cart = await prisma.keranjang.create({
        data: {
          id_user: req.user.id_user,
          id_meja: availableMeja.id_meja,
          nama_pelanggan: nama_pelanggan, 
        },
      });
    } else {
      cart = await prisma.keranjang.update({
        where: {
          id_cart: cart.id_cart,
        },
        data: {
          nama_pelanggan: nama_pelanggan, 
        },
      });
    }

    const items = req.body.items; 

    for (const item of items) {
      const menu = await prisma.menu.findFirst({
        where: {
          id_menu: item.id_menu,
        },
      });

      if (!menu) {
        return res.json({
          status: "Fail",
          code: 404,
          message: `Menu with id ${item.id_menu} not found`,
        });
      }

      const existingCartItem = await prisma.keranjangMenu.findFirst({
        where: {
          id_cart: cart.id_cart,
          id_menu: menu.id_menu,
        },
      });

      if (existingCartItem) {
        await prisma.keranjangMenu.update({
          where: {
            id_cart_id_menu: {
              id_cart: cart.id_cart,
              id_menu: menu.id_menu,
            },
          },
          data: {
            quantity: existingCartItem.quantity + item.quantity,
          },
        });
      } else {
        await prisma.keranjangMenu.create({
          data: {
            id_cart: cart.id_cart,
            id_menu: menu.id_menu,
            quantity: item.quantity,
          },
        });
      }
    }

    return res.json({
      status: "Success",
      message: "Items have been added to the cart",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "Fail",
      error: error.message,
    });
  }
};


exports.deleteItem = async (req, res) => {
  try {
    const existingcart = await prisma.keranjang.findFirst({
      where: {
        id_user: req.user.id,
        id_cart: +req.params.id,
      },
    });
    console.log(existingcart);
    if (existingcart) {
      await prisma.keranjangMenu.deleteMany({
        where: {
          id_cart: existingcart.id_cart,
        },
      });
      await prisma.keranjang.delete({
        where: {
          id_cart: existingcart.id_cart,
        },
      });
      return res.json({
        status: "Success",
        message: "Data has been deleted",
      });
    }
    return res.json({
      status: "Fail",
      code: 404,
      message: "Cart not found",
    });
  } catch (error) {
    return res.json({
      status: "Fail",
      error: error,
    });
  }
};

exports.changeQuantity = async (req, res) => {
  try {
    // Validate the request body (if using Zod or any validation library)
    const validatedData = changeQuantitySchema.parse(req.body);

    const cartId = +req.params.id;
    const menus = validatedData.menus; // Array of { id_menu, quantity }

    // Loop through the menus array and update the quantity for each menu in the cart
    const updatePromises = menus.map(async (menuItem) => {
      const existingCartMenu = await prisma.keranjangMenu.findFirst({
        where: {
          id_cart: cartId,
          id_menu: menuItem.id_menu,
          keranjang: {
            id_user: req.user.id_user, // Ensure the cart belongs to the current user
          },
        },
      });

      if (existingCartMenu) {
        // Update the quantity for each menu in the cart
        return prisma.keranjangMenu.update({
          where: {
            id_cart_id_menu: {
              id_cart: cartId,
              id_menu: menuItem.id_menu,
            },
          },
          data: {
            quantity: menuItem.quantity,
          },
        });
      } else {
        // If the menu is not found in the cart, you can handle it (e.g., skip or return an error)
        return res.json({
          status: "Fail",
          code: 404,
          message: "Meja not found",
        });
      }
    });

    // Wait for all updates to complete
    const updatedCartMenus = await Promise.all(updatePromises);

    // Return a success response
    return res.json({
      status: "Success",
      data: updatedCartMenus,
      message: "Cart quantities have been updated",
    });
  } catch (error) {
    return res.json({
      status: "Fail",
      error: error.message,
    });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await prisma.keranjang.findMany({
      where: {
        id_user: req.user.id_user,
      },
    });
    console.log(cart);
    return res.json({
      status: "Success",
      data: cart,
      message: "Cart datas have been loaded",
    });
  } catch (error) {
    return res.json({
      status: "Fail",
      error: error,
    });
  }
};

exports.findCart = async (req, res) => {
  try {
    const cart = await prisma.keranjang.findFirst({
      where: {
        id_cart: +req.params.id,
      },
      include: {
        meja: true,
        user: true,
        KeranjangMenu: {
          include: {
            menu: true,
          },
        },
      },
    });
    if(!cart){
      return res.json({
        status: "Fail",
        code : 404,
        message: "Cart not found",
      });
    }
    console.log(cart);
    return res.json({
      status: "Success",
      data: cart,
      message: "Cart datas have been loaded",
    });
  } catch (error) {
    return res.json({
      status: "Fail",
      error: error,
    });
  }
};