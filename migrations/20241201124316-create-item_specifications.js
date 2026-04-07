'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('item_specifications', {
      spec_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'item_master',
          key: 'item_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      field_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'specification_fields',
          key: 'field_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      value: {
        type: Sequelize.TEXT,
        allowNull: true,
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
      }
     
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('item_specifications');
  },
};