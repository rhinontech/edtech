const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const authenticate = require("../middlewares/authenticate");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", asyncHandler(authController.login));
router.get("/me", authenticate, asyncHandler(authController.me));
router.post("/logout", authenticate, asyncHandler(authController.logout));

module.exports = router;
