"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "password_hash",
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "role_id",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "is_active",
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "last_login_at",
      },
    },
    {
      tableName: "users",
      underscored: true,
    }
  );

  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: "roleId", as: "Role" });
  };

  // Requires `Role` (and, for the sidebar, `Role.SidebarItems`) to already be
  // eager-loaded on the instance — see authenticate.js / auth.controller.js.
  User.prototype.toPublicJSON = function toPublicJSON() {
    const role = this.Role;
    const sidebarItems = (role?.SidebarItems || [])
      .filter((item) => item.isEnabled)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => ({ key: item.key, label: item.label, path: item.path }));

    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: { slug: role.slug, name: role.name },
      sidebarItems,
      isActive: this.isActive,
      lastLoginAt: this.lastLoginAt,
      createdAt: this.createdAt,
    };
  };

  return User;
};
