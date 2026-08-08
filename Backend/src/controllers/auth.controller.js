const { User, Role, SidebarItem, sequelize } = require("../models");
const { comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");

async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({
    where: { email: String(email).toLowerCase().trim() },
    include: [{ model: Role, as: "Role", include: [{ model: SidebarItem, as: "SidebarItems" }] }],
  });

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
  const [rows] = await sequelize.query(`
    SELECT r.slug AS role, COUNT(u.id)::int AS count
    FROM roles r
    LEFT JOIN users u ON u.role_id = r.id
    GROUP BY r.slug
  `);

  const byRole = rows.reduce((acc, row) => {
    acc[row.role] = row.count;
    return acc;
  }, {});

  const totalUsers = Object.values(byRole).reduce((sum, n) => sum + n, 0);

  res.json({ totalUsers, byRole });
}

module.exports = { login, me, logout, overview };
