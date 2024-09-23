const z = require("zod");

exports.changeQuantitySchema = z.object({
  menus: z.array(
    z.object({
      id_menu: z.number(),
      quantity: z.number(),
    })
  ),
});
