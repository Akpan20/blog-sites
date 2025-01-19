'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'akan_akpan',
        email: 'skyconet@gmail.com',
        password: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'oiza_akpan',
        email: 'oiza@gmail.com',
        password: '456',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};