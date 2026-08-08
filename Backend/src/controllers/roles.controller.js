const { Role, SidebarItem, User, sequelize } = require("../models");

const RESERVED_SLUGS = new Set(["auth", "api", "_next", "favicon.ico"]);

function slugify(name) {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uniqueSlug(name) {
  const base = slugify(name) || "role";
  let slug = base;
  let suffix = 2;

  while (await Role.findOne({ where: { slug } })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

function serializeRole(role) {
  return {
    id: role.id,
    name: role.name,
    slug: role.slug,
    isSystem: role.isSystem,
    userCount: role.Users ? role.Users.length : undefined,
    sidebarItemKeys: (role.SidebarItems || []).map((item) => item.key),
  };
}

const roleInclude = [
  { model: SidebarItem, as: "SidebarItems" },
  { model: User, as: "Users", attributes: ["id"] },
];

async function list(req, res) {
  const roles = await Role.findAll({ include: roleInclude, order: [["createdAt", "ASC"]] });
  res.json({ roles: roles.map(serializeRole) });
}

async function catalog(req, res) {
  const items = await SidebarItem.findAll({ order: [["sortOrder", "ASC"]] });
  res.json({
    sidebarItems: items.map((item) => ({
      key: item.key,
      label: item.label,
      path: item.path,
      isEnabled: item.isEnabled,
    })),
  });
}

async function create(req, res) {
  const { name, sidebarItemKeys } = req.body || {};

  if (!name || !String(name).trim()) {
    return res.status(400).json({ message: "Role name is required" });
  }

  const slug = await uniqueSlug(name);

  if (RESERVED_SLUGS.has(slug)) {
    return res.status(400).json({ message: `"${name}" is a reserved name` });
  }

  const role = await sequelize.transaction(async (t) => {
    const created = await Role.create({ name: String(name).trim(), slug, isSystem: false }, { transaction: t });

    if (Array.isArray(sidebarItemKeys) && sidebarItemKeys.length > 0) {
      const items = await SidebarItem.findAll({ where: { key: sidebarItemKeys }, transaction: t });
      await created.setSidebarItems(items, { transaction: t });
    }

    return created;
  });

  const withRelations = await Role.findByPk(role.id, { include: roleInclude });
  res.status(201).json({ role: serializeRole(withRelations) });
}

async function update(req, res) {
  const { id } = req.params;
  const { name, sidebarItemKeys } = req.body || {};

  const role = await Role.findByPk(id);
  if (!role) {
    return res.status(404).json({ message: "Role not found" });
  }

  await sequelize.transaction(async (t) => {
    if (name && String(name).trim()) {
      role.name = String(name).trim();
      await role.save({ transaction: t });
    }

    if (Array.isArray(sidebarItemKeys)) {
      const items = await SidebarItem.findAll({ where: { key: sidebarItemKeys }, transaction: t });
      await role.setSidebarItems(items, { transaction: t });
    }
  });

  const withRelations = await Role.findByPk(role.id, { include: roleInclude });
  res.json({ role: serializeRole(withRelations) });
}

async function remove(req, res) {
  const { id } = req.params;

  const role = await Role.findByPk(id, { include: roleInclude });
  if (!role) {
    return res.status(404).json({ message: "Role not found" });
  }

  if (role.isSystem) {
    return res.status(400).json({ message: "Built-in roles can't be deleted" });
  }

  if (role.Users.length > 0) {
    return res.status(400).json({
      message: `${role.Users.length} user(s) still have this role. Reassign them first.`,
    });
  }

  await role.destroy();
  res.status(204).end();
}

module.exports = { list, catalog, create, update, remove };
