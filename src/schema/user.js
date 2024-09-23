const z = require("zod");

exports.SignUpSchema = z.object({
  nama_user: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

exports.addUserSchema = z.object({
  nama_user: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "KASIR", "MANAJER"]),
});

exports.updateRoleSchema = z.object({
  role: z.enum(["ADMIN", "KASIR", "MANAJER"]),
});

