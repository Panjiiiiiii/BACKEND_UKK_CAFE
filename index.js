const { PORT } = require("./src/schema/secret");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const auth = require("./src/routes/auth.routes");
const user = require("./src/routes/user.routes");
const meja = require("./src/routes/meja.routes");
const menu = require("./src/routes/menu.routes");
const keranjang = require("./src/routes/keranjang.routes");
const transaksi = require("./src/routes/transaksi.routes");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/auth", auth);
app.use("/user", user);
app.use("/meja", meja);
app.use("/menu", menu);
app.use("/cart", keranjang);
app.use("/order", transaksi)

app.listen(PORT, () => {
  console.log(`App is running at port ${PORT}`);
});
