"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class item_specifications extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {
      // Item relation
      this.belongsTo(models.item_master, {
        foreignKey: "item_id",
        as: "item",
      });

      // Specification Field relation
      this.belongsTo(models.specification_fields, {
        foreignKey: "field_id",
        as: "field",
      });

      // Created By relation
      this.belongsTo(models.users, {
        foreignKey: "created_by",
        as: "createdBy",
      });

      // Updated By relation
      this.belongsTo(models.users, {
        foreignKey: "updated_by",
        as: "updatedBy",
      });
    }
  }

  item_specifications.init(
    {
      spec_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "item_master",
          key: "item_id",
        },
      },
      field_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "specification_fields",
          key: "field_id",
        },
      },
      value: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.STRING,
      },
      created_at: {
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
      created_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      updated_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "user_id",
        },
      },
    },
    {
      sequelize,
      modelName: "item_specifications",
      timestamps: false, // since created_at & updated_at are manual
      underscored: true,
      freezeTableName: true,
      primaryKey: "spec_id",
    }
  );

  return item_specifications;
};