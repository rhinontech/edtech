const { MAX_IMAGE_MB } = require("./imageUpload");

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === "MulterError") {
    const status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    const message = err.code === "LIMIT_FILE_SIZE" ? `That image is too large (max ${MAX_IMAGE_MB} MB)` : err.message;
    return res.status(status).json({ message });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large" });
  }

  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({ message: err.errors?.[0]?.message || "Invalid data" });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
}

module.exports = errorHandler;
