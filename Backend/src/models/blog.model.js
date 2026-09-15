"use strict";

const { CONTENT_STATUSES, THEMES } = require("../utils/content");

module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define(
    "Blog",
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
      excerpt: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "",
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
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
      contentHtml: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "",
        field: "content_html",
      },
      faqs: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      tags: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      readTime: {
        type: DataTypes.STRING(40),
        allowNull: false,
        defaultValue: "1 min read",
        field: "read_time",
      },
      authorName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "UpperCurve Editorial",
        field: "author_name",
      },
      authorRole: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
        field: "author_role",
      },
      authorAvatar: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "author_avatar",
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
      publishDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "publish_date",
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
      tableName: "blogs",
      underscored: true,
    }
  );

  Blog.associate = (models) => {
    Blog.belongsTo(models.User, { foreignKey: "createdById", as: "CreatedBy" });
    Blog.belongsTo(models.User, { foreignKey: "updatedById", as: "UpdatedBy" });
  };

  return Blog;
};
