const { uploadContentImage } = require("../utils/storage");
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

module.exports = { uploadImage };
