const express = require("express");
const transaksi = require("../controllers/transaksi");
const authorize = require("../middlewares/auth");
const kasirValidator = require("../middlewares/kasir-validator");
const manajerValidator = require("../middlewares/manager-validator");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

app.get("/", authorize.authorize, transaksi.getOrder);
app.get("/", authorize.authorize, kasirValidator.isKasir, transaksi.getOrder);
app.get("/date/", authorize.authorize, manajerValidator.isManajer, transaksi.getTransaksiByDate);
app.get("/user/:id", authorize.authorize, manajerValidator.isManajer,transaksi.getDatabyUser);
app.get("/struk/:id", authorize.authorize, kasirValidator.isKasir,transaksi.createStruk);
app.put("/:id", authorize.authorize, kasirValidator.isKasir,transaksi.changeStatus);
app.post("/", authorize.authorize, kasirValidator.isKasir,transaksi.createOrder);

module.exports = app;
