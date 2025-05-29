'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sub_categories', {
      
      sub_cat_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      prefix: {
        type: Sequelize.STRING
      },
      sec_num: {
        type: Sequelize.INTEGER
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'item_categories', 
          key: 'category_id',
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
      created_by: {
        type: Sequelize.INTEGER
      },
      updated_at: {
        type: Sequelize.DATE
      },
      updated_by: {
        type: Sequelize.INTEGER
      }
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sub_categories');
  }
};