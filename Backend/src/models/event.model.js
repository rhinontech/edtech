"use strict";

const { CONTENT_STATUSES, EVENT_MODES, THEMES } = require("../utils/content");

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    "Event",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: "Title is required" } },
      },
      tagline: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "",
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Workshop",
      },
      mode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "Online",
        validate: { isIn: [EVENT_MODES] },
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "start_date",
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "end_date",
      },
      timeLabel: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
        field: "time_label",
      },
      theme: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "indigo",
        validate: { isIn: [THEMES] },
      },
      coverImage: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "cover_image",
      },
      aboutHtml: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "",
        field: "about_html",
      },
      agenda: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      takeaways: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      audience: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      poster: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      instructor: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      priceLabel: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "100% Free",
        field: "price_label",
      },
      certificateLabel: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Included (Free)",
        field: "certificate_label",
      },
      metaTitle: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "meta_title",
      },
      metaDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "meta_description",
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "Draft",
        validate: { isIn: [CONTENT_STATUSES] },
      },
      createdById: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "created_by_id",
      },
      updatedById: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "updated_by_id",
      },
    },
    {
      tableName: "events",
      underscored: true,
    }
  );

  Event.associate = (models) => {
    Event.belongsTo(models.User, { foreignKey: "createdById", as: "CreatedBy" });
    Event.belongsTo(models.User, { foreignKey: "updatedById", as: "UpdatedBy" });
  };

  return Event;
};
