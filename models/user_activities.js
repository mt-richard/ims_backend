'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user_activities extends Model {
    static associate(models) {
      this.belongsTo(models.users, {
        foreignKey: 'created_by',
        as: 'users',
      });

    }
  }

  user_activities.init({
    activity_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,  
      autoIncrement: true 
    },
    activity: DataTypes.STRING,
    status: DataTypes.STRING,
    created_at: DataTypes.DATE,
    created_by: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users', 
        key: 'user_id'
      }
    },
    
  }, {
    sequelize,
    modelName: 'user_activities',
    timestamps: true, 
    createdAt: 'created_at',
    updatedAt: 'created_at', 
    underscored: true, 
    freezeTableName: true,  
  });

  return user_activities;
};
