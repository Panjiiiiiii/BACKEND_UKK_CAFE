const { PrismaClient, status } = require("@prisma/client");
const prisma = new PrismaClient();

exports.selectAllMeja = async (req, res) => {
  try {
    const meja = await prisma.meja.findMany();
    console.log(meja);
    return res.json({
      status: "Success",
      data: meja,
      message: "Datas have been loaded",
    });
  } catch (error) {
    return res.json({
      status: "Fail",
      error: error,
    });
  }
};

exports.addMeja = async (req, res) => {
  try {
    const { nomor_meja } = req.body;
    const existingMeja = await prisma.meja.findFirst({
      where: {
        nomor_meja: nomor_meja,
      },
    });
    if (existingMeja) {
      return res.json({
        message: "Meja already appeared",
      });
    }
    const newMeja = await prisma.meja.create({
      data: {
        nomor_meja: nomor_meja,
      },
    });
    return res.json({
      status: "Success",
      data: {
        newMeja,
      },
      message: "Register Success",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "Fail",
      error: error,
    });
  }
};

exports.deleteMeja = async (req, res) => {
  try {
    const id_meja = +req.params.id;
    const existingMeja = await prisma.meja.findFirst({
      where: {
        id_meja: id_meja,
      },
    });
    if (!existingMeja) {
      return res.json({
        status: "Fail",
        code: 404,
        message: "Meja not found",
      });
    }
    const deleteMeja = await prisma.meja.delete({
      where: {
        id_meja: id_meja,
      },
    });
    if (deleteMeja) {
      return res.json({
        status: "Success",
        message: "Data has been deleted",
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
