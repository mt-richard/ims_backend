"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class purchase_entry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.users, {
        foreignKey: "created_by",
        as: "createdBy",
      });

      this.belongsTo(models.item_master, {
        foreignKey: "item_id",
        as: "itemId",
      });

     
      this.belongsTo(models.suppliers, {
        foreignKey: "supplier_id",
        as: "supplieredBy",
      });

      this.belongsTo(models.locations, {
        foreignKey: "received_location",
        as: "receivedLocation",
      });
      this.belongsTo(models.division_detail, {
        foreignKey: "division",
        as: "divisionDetail",
      });
    }
  }
  purchase_entry.init(
    {
      purchase_id: {
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
          model: "item_master",
          key: "item_id",
        },
      },
      supplier_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "suppliers",
          key: "sup_id",
        },
      },
      quantity: DataTypes.INTEGER,
      qty_balance: DataTypes.INTEGER,
      doc_type: DataTypes.ENUM("GRN", "TRN", "ADJ", "REC"),
      supp_invoice_no: DataTypes.STRING,
      invoice_date: DataTypes.DATE,
      delivery_date: DataTypes.DATE,
      purchase_type: DataTypes.ENUM("local", "import"),
      received_location: {
        type: DataTypes.INTEGER,
        references: {
          model: "locations",
          key: "location_id",
        },
      },
      division: {
        type: DataTypes.INTEGER,
        references: {
          model: "division_detail",
          key: "division_id",
        },
      },
      fx_rate: DataTypes.DECIMAL,
      fx_symbol: DataTypes.STRING,
      fx_amount: DataTypes.DECIMAL,
      unit_price: DataTypes.DECIMAL,
      total_price: DataTypes.DECIMAL,
      warrant_info: DataTypes.TEXT,
      status: DataTypes.ENUM("active", "inactive"),
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
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
      modelName: "purchase_entry",
      tableName: 'purchase_entry',
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
      // freezeTableName: true,
      primaryKey: "purchase_id",
    }
  );
  return purchase_entry;
};
