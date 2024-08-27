'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('purchases', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      purchase_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      supplier_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'suppliers', // Nama tabel suppliers
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.fn('NOW'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('purchases');
  },
};
