const express = require("express");
const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");
const rolesRoutes = require("./roles.routes");
const sidebarItemsRoutes = require("./sidebarItems.routes");

const router = express.Router();

router.get("/health", (req, res) => res.json({ status: "ok" }));
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/roles", rolesRoutes);
router.use("/sidebar-items", sidebarItemsRoutes);

module.exports = router;
