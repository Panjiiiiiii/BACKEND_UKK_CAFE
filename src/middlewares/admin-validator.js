exports.isAdmin = async (req, res, next) => {
  const user = req.user;
  if (user.role == "ADMIN") {
    next();
  } else {
    return res.json({
      status: "Fail",
      code: 401,
      message: "FORBIDEN NOT AN ADMIN",
    });
  }
};
