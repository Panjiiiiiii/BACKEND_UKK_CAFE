const { PrismaClient } = require("@prisma/client");
const { addUserSchema, updateRoleSchema } = require("../schema/user");
const { hashSync } = require("bcrypt");

const prisma = new PrismaClient({
  log: ["query"],
});

//Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany();
    return res.json({
      status: "Success",
      data: allUsers,
      message: "Datas have been loaded",
    });
  } catch (error) {
    return res.json({
      status: "Fail",
      error: error,
    });
  }
};
//Select user
exports.selectUsers = async (req, res) => {
  try {
    const user_id = +req.params.id;
    const users = await prisma.user.findFirst({
      where: {
        id_user: user_id,
      },
    });
    if (!users) {
      return res.json({
        status: "Fail",
        code: 404,
        message: "User not found",
      });
    }
    return res.json({
      status: "Success",
      data: users,
      message: "Datas have been loaded",
    });
  } catch (error) {
    return res.json({
      status: "Fail",
      error: error,
    });
  }
};
//Add user
exports.addUser = async (req, res) => {
  try {
    addUserSchema.parse(req.body);
    const { email, password } = req.body;
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res.json({
        message: "Email already used",
      });
    }
    const newUser = await prisma.user.create({
      data: {
        ...req.body,
        password: hashSync(password, 10),
      },
    });
    return res.json({
      status: "Success",
      data: {
        newUser,
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
//Edit role
exports.updateRole = async (req, res) => {
  try {
    const newRole = updateRoleSchema.parse(req.body)
    const id_user = +req.params.id;
    const existingUser = await prisma.user.findFirst({
      where: {
        id_user: id_user,
      },
    });
    if (!existingUser) {
      return res.json({
        status: "Fail",
        code: 404,
        message: "User not found",
      });
    }
    const updateRole = await prisma.user.update({
      where: {
        id_user: id_user,
      },
      data: {
        role: newRole.role,
      },
    });
    return res.json({
      status: "Success",
      data: updateRole,
      message: "Data has been updated",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "Fail",
      error: error,
    });
  }
};
//Delete user
exports.deleteUser = async (req, res) => {
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