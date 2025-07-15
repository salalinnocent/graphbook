"use strict";

/** @type {import('sequelize-cli').Migration} */

console.log("Running the fake users file from seeders");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          avatar: "/uploads/avatar1.png",
          username: "Test User 1",
          password:
            "$2a$10$bE3ovf9/Tiy/d68bwNUQ0.zCjwtNFq9ukg9h4rhKiHCb6x5ncKife",
          email: "test1@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          avatar: "/uploads/avatar2.png",
          username: "Test User 2",
          password:
            "$2a$10$bE3ovf9/Tiy/d68bwNUQ0.zCjwtNFq9ukg9h4rhKiHCb6x5ncKife",
          email: "test2@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      //options parameter
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
