const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN || "1d";

function signToken(user) {
  const role = user.Role?.slug || user.role;
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name, role },
    secret,
    { expiresIn, algorithm: "HS256" }
  );
}

function verifyToken(token) {
  return jwt.verify(token, secret, { algorithms: ["HS256"] });
}

module.exports = { signToken, verifyToken };
