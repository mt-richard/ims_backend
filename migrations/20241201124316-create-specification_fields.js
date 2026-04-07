'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('specification_fields', {
      field_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      sub_category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sub_categories',
          key: 'sub_cat_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      field_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      field_type: {
        type: Sequelize.STRING,
        allowNull: true, // text, number, dropdown
      },

      is_required: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable('specification_fields');
  },
};