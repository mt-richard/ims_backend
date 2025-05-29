'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('divisions', {
      
      division_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      division_detail: {
        type: Sequelize.INTEGER,
        references: {
          model: 'division_detail', 
          key: 'division_id',
        },
        onUpdate: 'CASCADE', 
        onDelete: 'SET NULL'  
      },
      location_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'locations', 
          key: 'location_id',
        },
        onUpdate: 'CASCADE', 
        onDelete: 'SET NULL'  
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),  
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
    await queryInterface.dropTable('divisions');
  }
};