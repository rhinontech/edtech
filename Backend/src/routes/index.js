const express = require("express");
const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");
const rolesRoutes = require("./roles.routes");
const sidebarItemsRoutes = require("./sidebarItems.routes");
const contentRoutes = require("./content.routes");
const publicRoutes = require("./public.routes");

const router = express.Router();

router.get("/health", (req, res) => res.json({ status: "ok" }));
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/roles", rolesRoutes);
router.use("/sidebar-items", sidebarItemsRoutes);
router.use("/content", contentRoutes);
router.use("/public", publicRoutes);

module.exports = router;
