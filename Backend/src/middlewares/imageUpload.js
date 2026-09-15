const multer = require("multer");
const { IMAGE_MIME_TYPES, MAX_IMAGE_MB } = require("../utils/storage");

// Held in memory only long enough to stream to S3.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_MB * 1024 * 1024, files: 1 },
  fileFilter(req, file, cb) {
    if (IMAGE_MIME_TYPES.includes(file.mimetype)) return cb(null, true);
    const err = new Error("Only JPEG, PNG, WebP, GIF or AVIF images are allowed");
    err.status = 400;
    cb(err);
  },
});

module.exports = { imageUpload: upload.single("image"), MAX_IMAGE_MB };
