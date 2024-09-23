const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../schema/secret");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
    log: ["query"],
  });

exports.authorize = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header.split(" ")[1];
    if (!token) {
      return res.json({
        status: "Fail",
        code: 401,
        message: "User unauthorized",
      });
    }
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findFirst({
        where : {id_user: payload.id_user}
    })
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.json({
      status: "Fail",
      error: error,
    });
  }
};
