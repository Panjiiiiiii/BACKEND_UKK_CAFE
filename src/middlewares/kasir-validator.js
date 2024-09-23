exports.isKasir = async (req, res, next) => {
  const user = req.user;
  if (user.role == "KASIR") {
    next();
  } else {
    return res.json({
      status: "Fail",
      code: 401,
      message: "FORBIDEN NOT AN KASIR",
    });
  }
};
