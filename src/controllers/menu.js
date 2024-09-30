const { PrismaClient } = require("@prisma/client");
const path = require("path");
const fs = require("fs");
const upload = require("./multerconfig").single("gambar");

const prisma = new PrismaClient({
  log: ["query"],
});

exports.getMenu = async (req, res) => {
  try {
    const menu = await prisma.menu.findMany();

    return res.json({
      status: "Success",
      data: menu,
      message: "Datas have been loaded",
    });
  } catch (error) {
    return res.json({
      status: "Fail",
      error: error,
    });
  }
};

exports.findMenu = async (req, res) => {
  try {
    const search = req.params.search;
    const menu = await prisma.menu.findMany({
      where: {
        nama_menu: {
          contains: search,
          mode: "insensitive",
        },
      },
    });
    if (!menu) {
      return res.json({
        status: "Fail",
        code: 404,
        message: "Menu not found",
      });
    }
    return res.json({
      status: "Success",
      data: menu,
      message: "Datas have been loaded",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "Fail",
      error: error,
    });
  }
};

exports.addMenu = async (req, res) => {
  try {
    upload(req, res, async (error) => {
      if (error) {
        console.log(error);
      }
      if (!req.file) {
        return res.json({ message: "Nothing uploaded" });
      }
      const menu = await prisma.menu.create({
        data: {
          ...req.body,
          harga: +req.body.harga,
          gambar: req.file.filename,
        },
      });
      return res.json({
        status: "Success",
        data: menu,
        message: `Menu has been created`,
      });
    });
  } catch (error) {
    return res.json({
      status: "Fail",
      error: error,
    });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    upload(req, res, async (error) => {
      if (error) {
        console.log(error);
      } else {
        const menuId = +req.params.id;
        const updatedMenu = await prisma.menu.update({
          where: { id_menu: menuId },
          data: {
            ...req.body,
            harga: +req.body.harga,
            gambar: req.file ? req.file.filename : undefined,
          },
        });
        return res.json({
          success: true,
          data: updatedMenu,
          message: "Menu has been updated",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "Fail",
      error: error,
    });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const menuId = +req.params.id;

    const menuToDelete = await prisma.menu.findFirst({
      where: { id_menu: menuId },
    });

    if (!menuToDelete) {
      return res.json({
        status: "Fail",
        code: 404,
        message: "Menu not found",
      });
    }
    const deleteMenu = await prisma.menu.delete({
      where: { id_menu: menuId },
    });

    if (menuToDelete && menuToDelete.image) {
      const filePath = path.join(__dirname, "../assets", menuToDelete.image);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
    if (deleteMenu) {
      return res.json({
        success: true,
        data: menuToDelete,
        message: "Menu have been deleted",
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

exports.getMenuImage = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../assets", filename);
  res.sendFile(filePath, (error) => {
    if (error) {
      return res.json({
        status: "Fail",
        error: error,
      });
    }
  });
};
