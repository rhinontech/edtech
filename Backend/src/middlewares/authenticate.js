const { verifyToken } = require("../utils/jwt");
const { User, Role, SidebarItem } = require("../models");

async function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const payload = verifyToken(token);
    const user = await User.findByPk(payload.sub, {
      include: [{ model: Role, as: "Role", include: [{ model: SidebarItem, as: "SidebarItems" }] }],
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid session" });
    }

    req.user = user;
    // Convenience string used by authorize() and any code that just needs the slug.
    req.user.role = user.Role.slug;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}

module.exports = authenticate;
