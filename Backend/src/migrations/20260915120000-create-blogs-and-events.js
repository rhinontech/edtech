"use strict";

// Blogs and events for the UpperCurve landing site. Body copy is stored as
// sanitized rich-text HTML (authored in the admin panel's TipTap editor);
// list-shaped event data (agenda, takeaways, …) is JSONB.

function timestamps(Sequelize) {
  return {
    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
  };
}

function authorColumns(Sequelize) {
  const ref = {
    type: Sequelize.UUID,
    allowNull: true,
    references: { model: "users", key: "id" },
    onDelete: "SET NULL",
  };
  return { created_by_id: ref, updated_by_id: ref };
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("blogs", {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      title: { type: Sequelize.STRING, allowNull: false },
      excerpt: { type: Sequelize.TEXT, allowNull: false, defaultValue: "" },
      category: { type: Sequelize.STRING, allowNull: true },
      theme: { type: Sequelize.STRING(20), allowNull: false, defaultValue: "indigo" },
      cover_image: { type: Sequelize.TEXT, allowNull: true },
      content_html: { type: Sequelize.TEXT, allowNull: false, defaultValue: "" },
      faqs: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
      tags: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
      read_time: { type: Sequelize.STRING(40), allowNull: false, defaultValue: "1 min read" },
      author_name: { type: Sequelize.STRING, allowNull: false, defaultValue: "UpperCurve Editorial" },
      author_role: { type: Sequelize.STRING, allowNull: false, defaultValue: "" },
      author_avatar: { type: Sequelize.TEXT, allowNull: true },
      meta_title: { type: Sequelize.STRING, allowNull: true },
      meta_description: { type: Sequelize.TEXT, allowNull: true },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: "Draft" },
      publish_date: { type: Sequelize.DATEONLY, allowNull: false, defaultValue: Sequelize.literal("CURRENT_DATE") },
      ...authorColumns(Sequelize),
      ...timestamps(Sequelize),
    });
    await queryInterface.addIndex("blogs", ["status", "publish_date"], { name: "blogs_status_publish_date" });

    await queryInterface.createTable("events", {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      title: { type: Sequelize.STRING, allowNull: false },
      tagline: { type: Sequelize.TEXT, allowNull: false, defaultValue: "" },
      type: { type: Sequelize.STRING, allowNull: false, defaultValue: "Workshop" },
      mode: { type: Sequelize.STRING(20), allowNull: false, defaultValue: "Online" },
      location: { type: Sequelize.STRING, allowNull: false, defaultValue: "" },
      start_date: { type: Sequelize.DATEONLY, allowNull: true },
      end_date: { type: Sequelize.DATEONLY, allowNull: true },
      time_label: { type: Sequelize.STRING, allowNull: false, defaultValue: "" },
      theme: { type: Sequelize.STRING(20), allowNull: false, defaultValue: "indigo" },
      cover_image: { type: Sequelize.TEXT, allowNull: true },
      about_html: { type: Sequelize.TEXT, allowNull: false, defaultValue: "" },
      agenda: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
      takeaways: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
      audience: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
      poster: { type: Sequelize.JSONB, allowNull: false, defaultValue: {} },
      instructor: { type: Sequelize.JSONB, allowNull: false, defaultValue: {} },
      price_label: { type: Sequelize.STRING, allowNull: false, defaultValue: "100% Free" },
      certificate_label: { type: Sequelize.STRING, allowNull: false, defaultValue: "Included (Free)" },
      meta_title: { type: Sequelize.STRING, allowNull: true },
      meta_description: { type: Sequelize.TEXT, allowNull: true },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: "Draft" },
      ...authorColumns(Sequelize),
      ...timestamps(Sequelize),
    });
    await queryInterface.addIndex("events", ["status", "start_date"], { name: "events_status_start_date" });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("events");
    await queryInterface.dropTable("blogs");
  },
};
