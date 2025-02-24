"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class stock_adjustments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.belongsTo(models.users, {
        foreignKey: "adjusted_by",
        as: "adjustedBy",
      });

      this.belongsTo(models.users, {
        foreignKey: "rejected_by",
        as: "rejectedBy",
      });

      this.belongsTo(models.users, {
        foreignKey: "approved_by",
        as: "approvedBy",
      });

      this.belongsTo(models.item_master, {
        foreignKey: "item_id",
        as: "itemId",
      });

      this.belongsTo(models.adjustment_reasons, {
        foreignKey: "reason_id",
        as: "reasonId",
      });

      this.belongsTo(models.locations, {
        foreignKey: 'location',
        as: 'Location',
      });

      this.belongsTo(models.divisions, {
        foreignKey: 'division',
        as: 'divisionId',
      });
    }
  }
  stock_adjustments.init(
    {
      adjust_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      ref_no: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      item_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "inevntory_items",
          key: "item_id",
        },
      },
      quantity: DataTypes.INTEGER,
      qty_balance: DataTypes.INTEGER,
      location: {
        type: DataTypes.INTEGER,
        references: {
          model: "locations",
          key: "location_id",
        },
      },
      division: {
        type: DataTypes.INTEGER,
        references: {
          model: "divisions",
          key: "division_id",
        },
      },
      employee: {
        type: DataTypes.INTEGER,
        references: {
          model: "employees",
          key: "employee_id",
        },
      },
      reason_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      comment: DataTypes.TEXT,
      adjusted_at: DataTypes.DATE,
      adjusted_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      status: DataTypes.ENUM("Pending", "Approved", "Rejected"),
      doc_type: DataTypes.ENUM("GRN", "TRN", "ADJ", "REC"),
      rejected_at: DataTypes.DATE,
      reject_reason: DataTypes.TEXT,
      rejected_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      approved_at: DataTypes.DATE,
      approved_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "user_id",
        },
      },
    },
    {
      sequelize,
      modelName: "stock_adjustments",
      timestamps: true,
      createdAt: "adjusted_at",
      updatedAt: "approved_at",
      underscored: true,
      freezeTableName: true,
      primaryKey: "adjust_id",
    }
  );
  return stock_adjustments;
};
