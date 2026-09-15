const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const blogsController = require("../controllers/blogs.controller");
const eventsController = require("../controllers/events.controller");

const router = express.Router();

// Unauthenticated, read-only feed for the UpperCurve landing site.
// Only published content is ever returned.
router.get("/blogs", asyncHandler(blogsController.publicList));
router.get("/blogs/:slug", asyncHandler(blogsController.publicGet));
router.get("/events", asyncHandler(eventsController.publicList));
router.get("/events/:slug", asyncHandler(eventsController.publicGet));

module.exports = router;
