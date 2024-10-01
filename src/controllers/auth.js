const { PrismaClient } = require("@prisma/client");
const { hashSync, compareSync } = require("bcrypt");
const jwt = require(`jsonwebtoken`);
const { JWT_SECRET } = require("../schema/secret");
const { SignUpSchema } = require("../schema/user");

const prisma = new PrismaClient({
  log: ["query"],
});

exports.register = async (req, res) => {
  try {
    SignUpSchema.parse(req.body);
    const { nama_user, username, email, password } = req.body;
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

    let newAdmin = await prisma.user.create({
      data: {
        nama_user,
        username,
        email,
        password: hashSync(password, 10),
      },
    });
    return res.json({
      status: "Success",
      data: {
        newAdmin,
      },
      message: "Register Success",
    });
  } catch (error) {
    return res.json({
      status: "Fail",
      error: error,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!existingUser) {
      return res.json({
        status: "Fail",
        errorCode: 404,
        message: "Email not found",
      });
    }
    if (!compareSync(password, existingUser.password)) {
      return res.json({
        status: "Fail",
        errorCode: 401,
        message: "Wrong Password",
      });
    }
    const token = jwt.sign(
      { id_user: existingUser.id_user, role: existingUser.role },
      JWT_SECRET
    );
    return res.json({
      status: "Success",
      data: existingUser,
      token: token,
      message: `Welcome ${existingUser.role}`,
    });
  } catch (error) {
    return res.json({
      status: "Fail",
      error: error,
    });
  }
};

exports.wrongPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!existingUser) {
      return res.json({
        status: "Fail",
        errorCode: 404,
        message: "Email not found",
      });
    }
    const newPassword = await prisma.user.update({
      where: {
        id_user : existingUser.id_user
      },
      data: {
        password: hashSync(password, 10),
      },
    });
    if (newPassword) {
      return res.json({
        status: "Success",
        message: "Password has been updated",
      });
    }
  } catch (error) {
    console.log(error)
  }
};

exports.me = async (req, res) => {
  return res.json(req.user);
};
