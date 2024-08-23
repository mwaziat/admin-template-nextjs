'use strict';

const bcrypt = require('bcryptjs');
const hashPassword = async (password) => {
  try {
    const salt = process.env.SALT || '$2a$10$VUtvjdtWfI5Rq3mxZT5MXe'
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Password hashing failed:', error);
    throw new Error('Password hashing failed', error);
  }
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await hashPassword('766');
    return queryInterface.bulkInsert('Users', [
      {
        id: 1,
        first_name: 'Waziat',
        last_name: 'Admin',
        name: 'Waziat Admin',
        username: 'admin',
        email: 'admin@admin.com',
        password: hashedPassword,
        is_active: true,
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
