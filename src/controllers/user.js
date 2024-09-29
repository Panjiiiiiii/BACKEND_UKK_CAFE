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
exports.updateUser = async (req, res) => {
  try {
    const newRole = updateRoleSchema.parse(req.body);
    const id_user = +req.params.id;
    const email = req.body.email;
    const password = req.body.password;

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
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (existingEmail) {
      return res.json({
        message: "Email is used",
      });
    }
    const updateRole = await prisma.user.update({
      where: {
        id_user: id_user,
      },
      data: {
        nama_user: req.body.nama_user || existingUser.nama_user,
        username: req.body.username || existingUser.username,
        email: email || existingUser.email,
        password: hashSync(password, 10) || hashSync(existingUser.password, 10),
        role: newRole.role || existingEmail.role,
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
        message: "Meja not found",
      });
    }
    const deleteUser = await prisma.user.delete({
      where: {
        id_user: id_user,
      },
    });
    if (deleteUser) {
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
