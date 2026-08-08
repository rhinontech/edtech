require("dotenv").config();

const { User, sequelize } = require("../models");
const { hashPassword } = require("./password");

async function bootstrapSuperadmin() {
  const email = (process.env.SUPERADMIN_EMAIL || "").toLowerCase().trim();
  const password = process.env.SUPERADMIN_PASSWORD;
  const name = process.env.SUPERADMIN_NAME || "Super Admin";

  if (!email || !password) {
    throw new Error(
      "SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD must be set in .env"
    );
  }

  const existing = await User.findOne({ where: { email } });

  if (existing) {
    console.log(`Superadmin already exists (${email}) — nothing to do.`);
    return existing;
  }

  const passwordHash = await hashPassword(password);

  const superadmin = await User.create({
    name,
    email,
    passwordHash,
    role: "superadmin",
    isActive: true,
  });

  console.log("Superadmin created:");
  console.log(`  email:    ${email}`);
  console.log(`  password: ${password}  (change this after first login)`);

  return superadmin;
}

if (require.main === module) {
  bootstrapSuperadmin()
    .then(() => sequelize.close())
    .catch((err) => {
      console.error("Failed to bootstrap superadmin:", err.message);
      process.exitCode = 1;
      return sequelize.close();
    });
}

module.exports = bootstrapSuperadmin;
