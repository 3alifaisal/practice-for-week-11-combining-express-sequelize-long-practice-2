'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('InsectTrees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      InsectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Insects',
          key: 'id',
          onDelete: 'CASCADE',
          // onUpdate: 'CASCADE',
        },
     
      
      },
      treeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Trees',
          key: 'id',
          onDelete: 'CASCADE',
          // onUpdate: 'CASCADE',
        },
      
        
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
       
    });
    await queryInterface.sequelize.query('PRAGMA foreign_keys = ON;');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('PRAGMA foreign_keys = OFF;');
    await queryInterface.dropTable('InsectTrees');
  }
};