'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('suppliers', {

      sup_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sup_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contact: {
        type: Sequelize.STRING,
        unique: true
      },
      address: {
        type: Sequelize.STRING,
      },
      currency: {
        type: Sequelize.STRING,
      },
      sup_type: {
        type: Sequelize.ENUM('local', 'external'),
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
      status: {
        type: Sequelize.ENUM('active', 'inactive'),  // ENUM for status
        allowNull: false,
        defaultValue: 'active'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
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
    // Drop the suppliers table and the associated ENUM type for status
    await queryInterface.dropTable('suppliers');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_suppliers_status";');  // Drop ENUM type for status
  }
};
