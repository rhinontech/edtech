"use strict";

module.exports = (sequelize, DataTypes) => {
  const SidebarItem = sequelize.define(
    "SidebarItem",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "sort_order",
      },
      isEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "is_enabled",
      },
    },
    {
      tableName: "sidebar_items",
      underscored: true,
    }
  );

  SidebarItem.associate = (models) => {
    SidebarItem.belongsToMany(models.Role, {
      through: models.RoleSidebarItem,
      foreignKey: "sidebarItemId",
      otherKey: "roleId",
      as: "Roles",
    });
  };

  return SidebarItem;
};
