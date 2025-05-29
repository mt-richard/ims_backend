'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchase_entry', {
      
      purchase_id: {
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
          model: 'item_master',
          key: 'item_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
      quantity: {
        type: Sequelize.INTEGER
      },
      qty_balance: {
        type: Sequelize.INTEGER
      },
      doc_type: {
        type: Sequelize.ENUM('GRN', 'TRN', 'REC', 'ADJ'),
        allowNull: false,
        defaultValue: 'GRN'
      },
      supp_invoice_no: {
        type: Sequelize.STRING
      },
      invoice_date: {
        type: Sequelize.DATE
      },
      delivery_date: {
        type: Sequelize.DATE
      },
      purchase_type: {
        type: Sequelize.ENUM('local', 'import'),
        allowNull: false,
      },
      received_location: {
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
          model: 'division_detail',
          key: 'division_id', 
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      fx_rate: {
        type: Sequelize.DECIMAL
      },
      fx_symbol: {
        type: Sequelize.STRING
      },
      fx_amount: {
        type: Sequelize.DECIMAL
      },
      unit_price: {
        type: Sequelize.DECIMAL
      },
      total_price: {
        type: Sequelize.DECIMAL
      },
      warrant_info: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('purchase_entry');
  }
};