'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stock_adjustments', {
      
      adjust_id: {
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
      quantity: {
        type: Sequelize.INTEGER
      },
      qty_balance: {
        type: Sequelize.INTEGER
      },
      doc_type: {
        type: Sequelize.ENUM('GRN', 'TRN', 'REC', 'ADJ'),
        allowNull: false,
        defaultValue: 'ADJ'
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
      reason_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'adjustment_reasons',
          key: 'reason_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      comment: {
        type: Sequelize.TEXT
      },
      adjusted_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      adjusted_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Approved', 'Rejected'),
        allowNull: false,
        defaultValue: 'Pending'
      },
      rejected_at: {
        type: Sequelize.DATE
      },
      reject_reason: {
        type: Sequelize.TEXT
      },
      rejected_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      approved_at: {
        type: Sequelize.DATE
      },
      approved_by: {
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
    await queryInterface.dropTable('stock_adjustments');
  }
};