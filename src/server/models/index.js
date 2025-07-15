import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (sequelize) => {
  const db = {};

  const files = fs
    .readdirSync(__dirname)
    .filter((file) => file !== "index.js" && file.endsWith(".js"));

  for (const file of files) {
    const filePath = path.join(__dirname, file);
    const fileUrl = pathToFileURL(filePath).href;

    const { default: mod } = await import(fileUrl); // ✅ Fix
    const model = mod(sequelize, Sequelize);        // ✅ Use it
    db[model.name] = model;
  }

  Object.values(db).forEach((model) => {
    if (typeof model.associate === "function") {
      model.associate(db);
    }
  });

  return db;
};
