const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const authController = require("../controllers/auth.controller");

const router = express.Router();

// RBAC demo: only superadmin/admin can view the dashboard overview.
router.get(
  "/overview",
  authenticate,
  authorize("superadmin", "admin"),
  asyncHandler(authController.overview)
);

module.exports = router;
