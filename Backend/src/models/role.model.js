"use strict";

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
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
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      isSystem: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_system",
      },
    },
    {
      tableName: "roles",
      underscored: true,
    }
  );

  Role.associate = (models) => {
    Role.hasMany(models.User, { foreignKey: "roleId", as: "Users" });
    Role.belongsToMany(models.SidebarItem, {
      through: models.RoleSidebarItem,
      foreignKey: "roleId",
      otherKey: "sidebarItemId",
      as: "SidebarItems",
    });
  };

  return Role;
};
