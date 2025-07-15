"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Posts", "userId", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addConstraint("Posts", {
      fields: ["userId"],
      type: "foreign key",
      name: "fk_user_id",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Posts", "fk_user_id");
    await queryInterface.removeColumn("Posts", "userId");
  },
};
