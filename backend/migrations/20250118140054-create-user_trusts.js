'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_trust', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Assumes 'users' table exists
          key: 'id',
        },
        onDelete: 'CASCADE', // Optional, ensures integrity
      },
      trustScore: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.5,
      },
      lastCalculated: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('user_trust', ['userId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_trust');
  },
};
