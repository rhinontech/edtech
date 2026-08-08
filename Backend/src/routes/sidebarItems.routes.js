const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const rolesController = require("../controllers/roles.controller");

const router = express.Router();

// The full catalog (including not-yet-built pages) is only needed by the
// Roles management screen, so it's gated the same way as roles themselves.
router.get("/", authenticate, authorize("superadmin"), asyncHandler(rolesController.catalog));

module.exports = router;
