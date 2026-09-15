const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const authenticate = require("../middlewares/authenticate");
const requireSidebarItem = require("../middlewares/requireSidebarItem");
const { imageUpload } = require("../middlewares/imageUpload");
const blogsController = require("../controllers/blogs.controller");
const eventsController = require("../controllers/events.controller");
const uploadsController = require("../controllers/uploads.controller");

const router = express.Router();

// CMS for the landing site. Each content type is gated by its sidebar item,
// so access is managed from the Roles screen like every other section.
router.use(authenticate);

const blogs = requireSidebarItem("blogs");
router.get("/blogs", blogs, asyncHandler(blogsController.list));
router.post("/blogs", blogs, asyncHandler(blogsController.create));
router.get("/blogs/:id", blogs, asyncHandler(blogsController.get));
router.patch("/blogs/:id", blogs, asyncHandler(blogsController.update));
router.delete("/blogs/:id", blogs, asyncHandler(blogsController.remove));

const events = requireSidebarItem("events");
router.get("/events", events, asyncHandler(eventsController.list));
router.post("/events", events, asyncHandler(eventsController.create));
router.get("/events/:id", events, asyncHandler(eventsController.get));
router.patch("/events/:id", events, asyncHandler(eventsController.update));
router.delete("/events/:id", events, asyncHandler(eventsController.remove));

router.post(
  "/uploads/sign",
  requireSidebarItem("blogs", "events"),
  asyncHandler(uploadsController.signImageUpload)
);
router.post(
  "/uploads",
  requireSidebarItem("blogs", "events"),
  imageUpload,
  asyncHandler(uploadsController.uploadImage)
);

module.exports = router;
