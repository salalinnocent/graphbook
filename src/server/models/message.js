"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //every message is associated to one user and chat
      Message.belongsTo(models.User);
      Message.belongsTo(models.Chat);
    }
  }
  Message.init(
    {
      text: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      chatId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Message",
    }
  );
  return Message;
};
