"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "email", {
      type: Sequelize.STRING,
      unique: true,
    }),
      await queryInterface.addColumn("Users", "password", {
        type: Sequelize.STRING,
      });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "email"),
      await queryInterface.removeColumn("Users", "password");
  },
};
