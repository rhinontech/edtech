const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const rolesController = require("../controllers/roles.controller");

const router = express.Router();

// Every route here is superadmin-only — role management is not a per-app
// permission, it's how permissions themselves get defined.
router.use(authenticate, authorize("superadmin"));

router.get("/", asyncHandler(rolesController.list));
router.post("/", asyncHandler(rolesController.create));
router.patch("/:id", asyncHandler(rolesController.update));
router.delete("/:id", asyncHandler(rolesController.remove));

module.exports = router;
