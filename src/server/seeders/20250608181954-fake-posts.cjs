"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //getting all existing users
    await queryInterface.sequelize
      .query("SELECT id from Users")
      .then((users) => {
        const userRows = users[0];

        return queryInterface.bulkInsert(
          "Posts",
          [
            {
              text: "Loren Ipsum 1",
              userId: userRows[0].id,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              text: "loren Ipsum 2",
              userId: userRows[1].id,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          //option parameter
          {}
        );
      });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Posts", null, {});
  },
};
