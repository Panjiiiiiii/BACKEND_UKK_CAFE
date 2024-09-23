exports.isManajer = async (req, res, next) => {
    const user = req.user;
    if (user.role == "MANAJER") {
      next();
    } else {
      return res.json({
        status: "Fail",
        code: 401,
        message: "FORBIDEN NOT A MANAJER",
      });
    }
  };
  