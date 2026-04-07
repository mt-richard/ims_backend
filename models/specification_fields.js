"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class specification_fields extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {
      // Sub Category relation
      this.belongsTo(models.sub_categories, {
        foreignKey: "sub_category_id",
        as: "subCategory",
      });

      // Created By
      this.belongsTo(models.users, {
        foreignKey: "created_by",
        as: "createdBy",
      });

      // Updated By
      this.belongsTo(models.users, {
        foreignKey: "updated_by",
        as: "updatedBy",
      });
    }
  }

  specification_fields.init(
    {
      field_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      sub_category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "sub_categories",
          key: "sub_category_id",
        },
      },
      field_name: {
        type: DataTypes.STRING,
      },
      field_type: {
        type: DataTypes.STRING, // text, number, dropdown
      },
      is_required: {
        type: DataTypes.BOOLEAN,
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
      modelName: "specification_fields",
      timestamps: false, // since you're manually handling created_at & updated_at
      underscored: true,
      freezeTableName: true,
      primaryKey: "field_id",
    }
  );

  return specification_fields;
};