import { Sequelize } from "sequelize";
import configFile from "../config/index.js";
import importModels from "../models/index.js";

const env = process.env.NODE_ENV || "development";
const config = configFile[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// ✅ Wrap in an async function and return it

const db = async () => {
  const models = await importModels(sequelize);
  return {
    models,
    sequelize,
  };
};
export default db;
