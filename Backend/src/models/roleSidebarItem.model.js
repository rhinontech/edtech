"use strict";

module.exports = (sequelize, DataTypes) => {
  const RoleSidebarItem = sequelize.define(
    "RoleSidebarItem",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "role_id",
      },
      sidebarItemId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "sidebar_item_id",
      },
    },
    {
      tableName: "role_sidebar_items",
      underscored: true,
      updatedAt: false,
    }
  );

  return RoleSidebarItem;
};
