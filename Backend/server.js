require("dotenv").config();

const app = require("./src/app");
const { sequelize } = require("./src/models");

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Unable to start server:", err.message);
    process.exit(1);
  }
}

start();
