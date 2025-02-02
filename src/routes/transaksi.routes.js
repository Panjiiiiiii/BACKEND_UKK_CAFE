const express = require("express");
const transaksi = require("../controllers/transaksi");
const authorize = require("../middlewares/auth");
const kasirValidator = require("../middlewares/kasir-validator");
const manajerValidator = require("../middlewares/manager-validator");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

app.get("/", authorize.authorize, transaksi.getOrder);
app.get("/user/:id", authorize.authorize, manajerValidator.isManajer,transaksi.getDatabyUser);
app.put("/:id", authorize.authorize, kasirValidator.isKasir,transaksi.changeStatus);
app.post("/:id", authorize.authorize, kasirValidator.isKasir,transaksi.createOrder);

module.exports = app;
