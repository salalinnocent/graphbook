// src/server/services/graphql/schema.js
import { gql } from "apollo-server-express";
//Schema.js
const typeDefs = gql`
  directive @auth on QUERY | FIELD_DEFINITION | FIELD
  # types
  type Post {
    id: Int
    text: String
    user: User
  }
  type User {
    id: Int
    avatar: String
    username: String
    email: String
  }
  type Message {
    id: Int
    text: String
    chat: Chat
    user: User
  }
  type Chat {
    id: Int
    messages: [Message]
    users: [User]
    lastMessage: Message
  }
  type PostFeed {
    posts: [Post!]
  }
  type Response {
    success: Boolean
  }
  type UsersSearch {
    users: [User]
  }
  type Auth {
    token: String
  }
  # mutation defination
  type RootMutation {
    addPost(post: PostInput!): Post
    updatePost(post: PostInput!, postId: Int!): Post
    addChat(chat: ChatInput!): Chat
    addMessage(message: MessageInput!): Message
    deletePost(postId: Int!): Response
    login(email: String!, password: String!): Auth
    signup(username: String!, email: String!, password: String!): Auth
  }
  # input types
  input PostInput {
    text: String!
  }
  input UserInput {
    username: String!
    avatar: String!
  }
  input ChatInput {
    users: [Int]
  }
  input MessageInput {
    text: String!
    chatId: Int!
  }

  # query defination
  type RootQuery {
    posts: [Post]
    chats: [Chat]
    chat(chatId: Int): Chat
    postsFeed(page: Int, limit: Int, username: String): PostFeed @auth
    usersSearch(page: Int, limit: Int, text: String!): UsersSearch
    currentUser: User @auth
    user(username: String!): User @auth
  }
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`;

export default typeDefs;
