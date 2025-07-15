import logger from "../../helpers/logger.js";
import db from "../../database/index.js";
import { Op, where } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const { JWT_SECRET } = process.env;
//static posts for testing

//RESOLVER.JS
export default async function resolver() {
  const { models, sequelize } = await db();
  const { Post, User, Chat, Message } = models;

  const resolvers = {
    //added post property to the resolver object
    Post: {
      user(post, args, context) {
        return post.getUser();
      },
    },
    Message: {
      user(message, args, context) {
        return message.getUser();
      },
      chat(message, args, context) {
        return message.getChat();
      },
    },
    Chat: {
      messages(chat, args, context) {
        return chat.getMessages({ order: [["id", "ASC"]] });
      },
      users(chat, args, context) {
        return chat.getUsers();
      },
      lastMessage(chat, args, context) {
        return chat
          .getMessage({ limit: 1, order: [["id", "DESC"]] })
          .then((message) => {
            return message[0];
          });
      },
    },
    //root query is the starting point where all the graphql queries begin
    RootQuery: {
      //currentUser
      currentUser: async (root, args, context) => {
        if (!context.user) return null;
        //converted the response to be a plain JSON Object
        const user = context.user.get({ plain: true });
        delete user.password;
        return user;
      },
      //posts
      posts(root, args, context) {
        return Post.findAll({
          order: [["createdAt", "DESC"]],
        });
      },
      //chats
      chats(root, args, context) {
        return Chat.findAll({
          include: [
            {
              model: User,
              required: true,
              through: { where: { userId: context.user.id } },
            },
            {
              model: Message,
            },
          ],
        });
      },
      //chatId
      chat(root, { chatId }, context) {
        return Chat.findByPk(chatId, {
          include: [
            {
              model: User,
              required: true,
            },
            {
              model: Message,
            },
          ],
        });
      },
      //postsFeed
      postsFeed(root, { page, limit, username }, context) {
        let skip = 0;
        if (page && limit) {
          skip = page * limit;
        }
        let query = {
          order: [["createdAt", "DESC"]],
          offset: skip,
        };
        if (limit) {
          query.limit = limit;
        }
        if (typeof username !== typeof undefined) {
          (query.include = [{ model: User }]),
            (query.where = {
              "$User.username$": username,
            });
        }
        return Post.findAll(query).then((posts) => ({
          posts: posts || [],
          _typename: "PostFeed",
        }));
      },

      //usersSearch Query
      usersSearch(root, { page, limit, text }, context) {
        if (text.length > 3) {
          return {
            users: [],
          };
        }
        let skip = 0;
        if (page && limit) {
          skip = page * limit;
        }
        let query = {
          order: [["createdAt", "DESC"]],
          offset: skip,
        };
        if (limit) {
          query.limit = limit;
        }
        query.where = {
          username: {
            [Op.like]: "%" + text + "%",
          },
        };
        return {
          users: User.findAll(query),
        };
      },
      //user
      user(root, { username }, context) {
        return User.findOne({
          where: {
            username: username,
          },
        });
      },
    },

    //handling changes to my database
    RootMutation: {
      //addPost
      addPost(root, { post }, context) {
        const loggedInUser = context.user;
        if (!loggedInUser) {
          throw new Error("Not authenticated");
        }

        return Post.create({
          ...post,
        }).then((newPost) => {
          return newPost.setUser(loggedInUser.id).then(() => newPost);
        });
      },
      //updatePost
      updatePost(root, { post, postId }, context) {
        return Post.update(
          {
            ...post,
          },
          {
            where: {
              id: postId,
            },
          }
        ).then((rows) => {
          //checking if zero
          if (rows[0] === 1) {
            logger.log({
              level: "info",
              message: "Post: " + postId + "was updated",
            });
            return Post.findbyId(postId);
          }
        });
      },
      //deletePost
      deletePost(root, { postId }, context) {
        return Post.destroy({
          where: {
            id: postId,
          },
        })
          .then((rows) => {
            if (rows === 1) {
              logger.log({
                level: "info",
                message: "Post: " + postId + "was deleted",
              });
              return { success: true };
            }
            return { success: false };
          })
          .catch((error) => {
            logger.log({
              level: "error",
              message: error.message,
            });
            return { success: false };
          });
      },

      //addChat
      addChat(root, { chat }, context) {
        logger.log({
          level: "info",
          message: "Message was created",
        });
        return Chat.create().then((newChat) => {
          return Promise.all([newChat.setUsers(chat.users)]).then(() => {
            return newChat;
          });
        });
      },
      //login
      login(root, { email, password }, context) {
        return User.findAll({
          where: {
            email,
          },
          raw: true,
        }).then(async (users) => {
          //the book has one equal sign with is an assignment operator, changed it to the === strict equality
          if (users.length === 1) {
            //checking if the user matches and only one of is there
            const user = users[0];
            const passwordValid = await bcrypt.compare(password, user.password);
            if (!passwordValid) {
              throw new Error("Password don't match");
            }
            const token = jwt.sign({ email, id: user.id }, JWT_SECRET, {
              expiresIn: "1d",
            });
            //  console.log("jwt secret is there", JWT_SECRET);
            return {
              token,
            };
          } else {
            throw new Error("User not found");
          }
        });
      },
      //signup
      signup(root, { email, username, password }, context) {
        return User.findAll({
          where: {
            [Op.or]: [{ email }, { username }],
          },
          raw: true,
        }).then(async (users) => {
          if (users.length) {
            throw new Error("User already exist");
          } else {
            return bcrypt.hash(password, 10).then((hash) => {
              return User.create({
                email,
                username,
                password: hash,
                activated: 1,
              }).then((newUser) => {
                const token = jwt.sign({ email, id: newUser.id }, JWT_SECRET, {
                  expiresIn: "1d",
                });
                return {
                  token,
                };
              });
            });
          }
        });
      },
      //addMessage
      addMessage(root, { message }, context) {
        logger.log({
          level: "info",
          message: "Message was created",
        });
        return User.findAll().then((users) => {
          const usersRow = users[0];
          return Message.create({
            ...message,
          }).then((newMessage) => {
            return Promise.all([
              newMessage.setUser(context.user.id),
              newMessage.setChat(message.id),
            ]).then(() => {
              return newMessage;
            });
          });
        });
      },
    },
  };
  return resolvers;
}
// export default function resolver() {
//   const { db } = utils;
//   const { Post } = db.models;
//   const resolvers = {

//   return {
//     RootQuery: {
//       posts(root, args, context) {
//         //   return [];
//         return Post.findAll({ order: [["createdAt", "DESC"]] });
//       },
//     },
//     RootMutation: {
//       addPost(root, { post, user }, context) {
//         const postObject = {
//           ...post,
//           user,
//           id: posts.length + 1,
//         };
//         posts.push(postObject);
//         logger.log({ level: "info", message: "Post was created" });
//         return postObject;
//       },
//     },
//   }

//   return resolvers;
// }
