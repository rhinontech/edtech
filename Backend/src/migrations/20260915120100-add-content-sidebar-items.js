"use strict";

const { randomUUID } = require("crypto");

// Blogs and Events become sidebar items, which is also how access to them is
// granted: a role can manage a content type iff it has that sidebar item
// (see middlewares/requireSidebarItem.js). Both built-in roles get them.
const NEW_ITEMS = [
  { key: "blogs", label: "Blogs", path: "content/blogs", sort_order: 2 },
  { key: "events", label: "Events", path: "content/events", sort_order: 3 },
];

// Existing items shift down to make room directly under Overview.
const SORT_ORDER_BEFORE = { overview: 1, roles: 2, users: 3, settings: 4 };
const SORT_ORDER_AFTER = { overview: 1, roles: 4, users: 5, settings: 6 };

async function applySortOrder(queryInterface, orders) {
  for (const [key, order] of Object.entries(orders)) {
    await queryInterface.bulkUpdate("sidebar_items", { sort_order: order }, { key });
  }
}

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const items = NEW_ITEMS.map((item) => ({
      ...item,
      id: randomUUID(),
      is_enabled: true,
      created_at: now,
      updated_at: now,
    }));

    await applySortOrder(queryInterface, SORT_ORDER_AFTER);
    await queryInterface.bulkInsert("sidebar_items", items);

    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE slug IN ('superadmin', 'admin')`
    );

    const links = roles.flatMap((role) =>
      items.map((item) => ({
        id: randomUUID(),
        role_id: role.id,
        sidebar_item_id: item.id,
        created_at: now,
      }))
    );

    if (links.length > 0) {
      await queryInterface.bulkInsert("role_sidebar_items", links);
    }
  },

  async down(queryInterface, Sequelize) {
    // role_sidebar_items rows cascade with the sidebar items.
    await queryInterface.bulkDelete("sidebar_items", {
      key: { [Sequelize.Op.in]: NEW_ITEMS.map((item) => item.key) },
    });
    await applySortOrder(queryInterface, SORT_ORDER_BEFORE);
  },
};
