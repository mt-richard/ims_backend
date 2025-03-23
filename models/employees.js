'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class employees extends Model {
    static associate(models) {

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

  employees.init({
    emp_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    emp_code: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    location: {
      type: DataTypes.INTEGER,
      references: {
        model: 'locations',
        key: 'location_id',
      },
    },
    division: {
      type: DataTypes.INTEGER,
      references: {
        model: 'divisions',
        key: 'division_id',
      },
    },
    status: DataTypes.ENUM('active', 'inactive'),
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
    modelName: 'employees',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    freezeTableName: true,
    primaryKey: 'emp_id',

  });

  return employees;
};