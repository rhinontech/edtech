function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({ message: err.errors?.[0]?.message || "Invalid data" });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
}

module.exports = errorHandler;
