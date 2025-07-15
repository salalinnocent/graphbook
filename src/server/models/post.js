// models/Post.js
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      // define association here
      Post.belongsTo(models.User);
      // User.hasMany(models.Post);
    }
  }

  Post.init(
    {
      text: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );

  return Post;
};
