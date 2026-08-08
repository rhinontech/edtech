"use strict";

const { randomUUID } = require("crypto");

const SUPERADMIN_ROLE_ID = randomUUID();
const ADMIN_ROLE_ID = randomUUID();

const SIDEBAR_ITEMS = [
  { id: randomUUID(), key: "overview", label: "Overview", path: "dashboard", sort_order: 1, is_enabled: true },
  { id: randomUUID(), key: "roles", label: "Roles", path: "roles", sort_order: 2, is_enabled: true },
  { id: randomUUID(), key: "users", label: "Users", path: "users", sort_order: 3, is_enabled: false },
  { id: randomUUID(), key: "settings", label: "Settings", path: "settings", sort_order: 4, is_enabled: false },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.createTable("roles", {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      is_system: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.createTable("sidebar_items", {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      key: { type: Sequelize.STRING, allowNull: false, unique: true },
      label: { type: Sequelize.STRING, allowNull: false },
      path: { type: Sequelize.STRING, allowNull: false },
      sort_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      is_enabled: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.createTable("role_sidebar_items", {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "roles", key: "id" },
        onDelete: "CASCADE",
      },
      sidebar_item_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "sidebar_items", key: "id" },
        onDelete: "CASCADE",
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addIndex("role_sidebar_items", ["role_id", "sidebar_item_id"], {
      unique: true,
      name: "role_sidebar_items_unique",
    });

    // Seed the two system roles and the sidebar-item catalog.
    await queryInterface.bulkInsert("roles", [
      { id: SUPERADMIN_ROLE_ID, name: "Super Admin", slug: "superadmin", is_system: true, created_at: now, updated_at: now },
      { id: ADMIN_ROLE_ID, name: "Admin", slug: "admin", is_system: true, created_at: now, updated_at: now },
    ]);

    await queryInterface.bulkInsert(
      "sidebar_items",
      SIDEBAR_ITEMS.map((item) => ({ ...item, created_at: now, updated_at: now }))
    );

    // Superadmin sees the full catalog; admin sees only Overview.
    await queryInterface.bulkInsert(
      "role_sidebar_items",
      SIDEBAR_ITEMS.map((item) => ({
        id: randomUUID(),
        role_id: SUPERADMIN_ROLE_ID,
        sidebar_item_id: item.id,
        created_at: now,
      }))
    );
    await queryInterface.bulkInsert("role_sidebar_items", [
      {
        id: randomUUID(),
        role_id: ADMIN_ROLE_ID,
        sidebar_item_id: SIDEBAR_ITEMS.find((i) => i.key === "overview").id,
        created_at: now,
      },
    ]);

    // Move users.role (enum) -> users.role_id (FK), preserving existing data.
    await queryInterface.addColumn("users", "role_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "roles", key: "id" },
    });

    await queryInterface.sequelize.query(
      `UPDATE users SET role_id = :id WHERE role = 'superadmin'`,
      { replacements: { id: SUPERADMIN_ROLE_ID } }
    );
    await queryInterface.sequelize.query(
      `UPDATE users SET role_id = :id WHERE role = 'admin'`,
      { replacements: { id: ADMIN_ROLE_ID } }
    );

    await queryInterface.changeColumn("users", "role_id", {
      type: Sequelize.UUID,
      allowNull: false,
    });

    await queryInterface.removeColumn("users", "role");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "role", {
      type: Sequelize.ENUM("superadmin", "admin"),
      allowNull: true,
    });

    await queryInterface.sequelize.query(`
      UPDATE users u SET role = r.slug
      FROM roles r
      WHERE u.role_id = r.id
    `);

    await queryInterface.changeColumn("users", "role", {
      type: Sequelize.ENUM("superadmin", "admin"),
      allowNull: false,
    });

    await queryInterface.removeColumn("users", "role_id");
    await queryInterface.dropTable("role_sidebar_items");
    await queryInterface.dropTable("sidebar_items");
    await queryInterface.dropTable("roles");
  },
};
