import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import Resolvers from "./resolver.js";
import Schema from "./schema.js";
import { authDirectiveTransformer } from "./auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { JWT_SECRET } = process.env;
//services/graphql/index.js
export default (utils) => {
  return async (app) => {
    let schema = makeExecutableSchema({
      typeDefs: Schema,
      //NOTE: await is important as the promise was going pending
      //so apollo was silently fails to hook up resolver, fix: await
      resolvers: await Resolvers(utils),
    });
    //applied the authDirective to our schema as whole
    schema = authDirectiveTransformer(schema, "auth");

    const server = new ApolloServer({
      schema,
      context: async ({ req }) => {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (token) {
          try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const { models } = await utils.db();
            const user = await models.User.findByPk(decoded.id);
            return { user };
          } catch (error) {
            console.log("Failed to verify token: ", error);
          }
        }
        return {};
      },
    });

    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });
  };
};
//the book version fetched the whole user info from the db: I didnt do it maybe look into it later
//beacuse I have added authDirectiveTransformer I have declared the file with schema
// export default (utils) => {
//   const executableSchema = makeExecutableSchema({
//     typeDefs: Schema,
//     resolvers: Resolvers.call(utils),
//   });

//   const server = new ApolloServer({
//     schema: executableSchema,
//     context: ({ req }) => req,
//   });

//   return server;
// };
// export default async (app, utils) => {
//   const executableSchema = makeExecutableSchema({
//     typeDefs: Schema,
//     resolvers: resolvers(utils),
//   });
//   const server = new ApolloServer({
//     schema: executableSchema,
//     context: ({ req }) => req,
//   });
//   await server.start();
//   server.applyMiddleware({ app });
// };

// let server;
// export default (utils) => {
//   if (!utils) {
//     throw new Error("No utils in graphql index.js file");
//   }
//   const executableSchema = makeExecutableSchema({
//     typeDefs: Schema,
//     resolvers: resolvers(utils),
//   });
//   server = new ApolloServer({
//     schema: executableSchema,
//     context: ({ req }) => req,
//   });
// };

// export const startGraphQLServer = async (app) => {
//   await server.start();
//   server.applyMiddleware({ app });
// };
