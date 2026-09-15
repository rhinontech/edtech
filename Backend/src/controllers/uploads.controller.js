const { uploadContentImage, createSignedImageUpload, IMAGE_MIME_TYPES, MAX_IMAGE_MB } = require("../utils/storage");
const { oneOf } = require("../utils/content");

// POST /api/content/uploads — multipart field "image", optional "folder".
async function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "Choose an image to upload" });
  }

  const folder = oneOf(req.body?.folder, ["blogs", "events"], "misc");
  const { url, key } = await uploadContentImage(req.file, folder);

  res.status(201).json({ url, key });
}

// POST /api/content/uploads/sign — { contentType, size, folder } → signed S3 POST.
// The admin panel uploads the file straight to S3 with it, then stores `url`.
async function signImageUpload(req, res) {
  const { contentType, size } = req.body || {};

  if (!IMAGE_MIME_TYPES.includes(contentType)) {
    return res.status(400).json({ message: "Only JPEG, PNG, WebP, GIF or AVIF images are allowed" });
  }
  if (typeof size === "number" && size > MAX_IMAGE_MB * 1024 * 1024) {
    return res.status(413).json({ message: `That image is too large (max ${MAX_IMAGE_MB} MB)` });
  }

  const folder = oneOf(req.body?.folder, ["blogs", "events"], "misc");
  res.status(201).json(await createSignedImageUpload(contentType, folder));
}

module.exports = { uploadImage, signImageUpload };
