'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('item_assign', {
      assign_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'item_master',
          key: 'item_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      tag_id: {
        type: Sequelize.STRING,
      },
      serial_number: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.INTEGER,
        references: {
          model: 'locations',
          key: 'location_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      division: {
        type: Sequelize.INTEGER,
        references: {
          model: 'divisions',
          key: 'division_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      employee: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'employees',
        //   key: 'employee_id',
        // },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      remark: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
         defaultValue: 'active'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      updated_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('item_assign');
  },
};