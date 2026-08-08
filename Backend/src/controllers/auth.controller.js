const { User, sequelize } = require("../models");
const { comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");

async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ where: { email: String(email).toLowerCase().trim() } });

  if (!user || !user.isActive) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const valid = await comparePassword(password, user.passwordHash);

  if (!valid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken(user);

  res.json({ token, user: user.toPublicJSON() });
}

async function me(req, res) {
  res.json({ user: req.user.toPublicJSON() });
}

async function logout(req, res) {
  // Stateless JWT — nothing to invalidate server-side yet.
  // Kept as a real endpoint so a token blacklist / refresh-token
  // revocation can be added later without changing the API shape.
  res.status(204).end();
}

async function overview(req, res) {
  const rows = await User.findAll({
    attributes: ["role", [sequelize.fn("COUNT", sequelize.col("id")), "count"]],
    group: ["role"],
    raw: true,
  });

  const byRole = rows.reduce((acc, row) => {
    acc[row.role] = Number(row.count);
    return acc;
  }, {});

  const totalUsers = Object.values(byRole).reduce((sum, n) => sum + n, 0);

  res.json({ totalUsers, byRole });
}

module.exports = { login, me, logout, overview };
