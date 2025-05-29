'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('item_master', {
      item_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sub_category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'sub_categories', 
          key: 'sub_cat_id',
        },
        onUpdate: 'CASCADE', 
        onDelete: 'SET NULL'  
      },
      item_name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      item_type: {
        type: Sequelize.ENUM('asset', 'expense', 'accessory', 'license'),
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      unit: {
        type: Sequelize.STRING
      },
      supplier_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'suppliers',
          key: 'sup_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      location: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      asset_id: {
        type: Sequelize.STRING,
        unique: true
      },
      division: {
        type: Sequelize.INTEGER,
        references: {
          model: 'division_detail',
          key: 'division_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      cost: {
        type: Sequelize.DECIMAL,
        defaultValue: 0
      },
      bin_location: {
        type: Sequelize.INTEGER
      },
      taxable: {
        type: Sequelize.ENUM('1', '0'),
        allowNull: true,
      },
      item_status: {
        type: Sequelize.ENUM('in-use', 'in-stock', 'scrapped', 'lost'),
        allowNull: false,
        defaultValue: 'in-stock'
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
      },

      license_start_time: {
        allowNull: true,
        type: Sequelize.DATE
      },
      license_expire_time: {
        allowNull: true,
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      updated_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
          });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('item_master');
  }
};