"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const userAndChats = Promise.all([
      queryInterface.sequelize.query("SELECT id from Users"),
      queryInterface.sequelize.query("SELECT id from Chats"),
    ]);
    return userAndChats.then((rows) => {
      const users = rows[0][0];
      const chats = rows[1][0];
      return queryInterface.bulkInsert("users_chats", [
        {
          userId: users[0].id,
          chatId: chats[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: users[1].id,
          chatId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users_chat", null, {});
  },
};
