'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('item_transfer', {
     
      transfer_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ref_no: {
        allowNull: false,
        type: Sequelize.STRING
      },
      item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'item_categories', 
          key: 'category_id',
        },
        onUpdate: 'CASCADE', 
        onDelete: 'SET NULL'  
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      qty_balance: {
        type: Sequelize.INTEGER
      },
      doc_type: {
        type: Sequelize.ENUM('GRN', 'TRN', 'REC', 'ADJ'),
        allowNull: false,
        defaultValue: 'TRN'
      },
      location: {
        type: Sequelize.INTEGER,
        references: {
          model: 'locations', 
          key: 'location_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      division: {
        type: Sequelize.INTEGER,
        references: {
          model: 'divisions', 
          key: 'division_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      employee: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: '1'
      },
      remark: {
        type:
         Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
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
    await queryInterface.dropTable('item_transfer');
  }
};