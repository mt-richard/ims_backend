'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class item_master extends Model {
    static associate(models) {
      this.belongsTo(models.sub_categories, {
        foreignKey: 'sub_category_id',
        as: 'category',
      });

      this.belongsTo(models.suppliers, {
        foreignKey: 'supplier_id',
        as: 'supplier',
      });

      this.belongsTo(models.users, {
        foreignKey: 'created_by',
        as: 'createdBy',
      });

      this.belongsTo(models.locations, {
        foreignKey: 'location',
        as: 'location_use',
      });
      
      this.belongsTo(models.divisions, {
        foreignKey: 'division',
        as: 'division_belong',
      });

      this.belongsTo(models.users, {
        foreignKey: 'updated_by',
        as: 'updatedBy',
      });
    }
  }

  item_master.init({
    item_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    sub_category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'sub_categories',
        key: 'sub_cat_id',
      },
    },
    item_name: DataTypes.STRING,
    description: DataTypes.TEXT,
    item_type: DataTypes.ENUM('asset', 'expense', 'accessory', 'license'),
    quantity: DataTypes.INTEGER,
    unit: DataTypes.STRING,
    supplier_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'suppliers',
        key: 'sup_id',
      },
    },
    asset_id: DataTypes.STRING,
    division: {
      type: DataTypes.INTEGER,
      references: {
        model: 'divisions',
        key: 'division_id',
      },
    },
    cost: DataTypes.DECIMAL,
    bin_location: DataTypes.INTEGER,
    taxable: DataTypes.ENUM('1', '0'),
    location: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    item_status: DataTypes.ENUM('in-use', 'in-stock', 'scrapped', 'lost'),
    status: DataTypes.ENUM('active', 'inactive'),
    license_start_time: DataTypes.DATE,
    license_expire_time: DataTypes.DATE,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    created_by: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    updated_by: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
  }, {
    sequelize,
    modelName: 'item_master',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    freezeTableName: true,
    primaryKey: 'item_id',

    hooks: {
      beforeCreate: async (item, options) => {
        const { locations } = sequelize.models;
        const allLocations = await locations.findAll({ attributes: ['location_id'] });

        item.location = allLocations.map(loc => ({ location_id: loc.location_id, qty: 0 }));
      },
    },
  });

  return item_master;
};