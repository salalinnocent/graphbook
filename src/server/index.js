import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import compress from "compression";
import servicesLoader from "../server/services/index.js"; // adjusted path
import db from "./database/index.js";
import { fileURLToPath } from "url";

const utils = {
  db,
};
const services = servicesLoader(utils);
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "../../");

//wrap my start server in an async function
const startSever = async () => {
  const serviceNames = Object.keys(services);
  for (let name of serviceNames) {
    if (typeof services[name] === "function") {
      if (name === "graphql") {
        await services[name](app); // load graphql
      } else {
        app.use(`/${name}`, services[name]);
      }
    } else {
      console.warn(
        `Service ${name} is not a function. Got`,
        typeof services[name]
      );
    }
  }

  app.use(compress());
  app.use(helmet());
  app.use(cors());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "*.amazonaws.com"],
      },
    })
  );
  app.use(helmet.referrerPolicy({ policy: "same-origin" }));
  app.use("/", express.static(path.join(root, "dist/client")));
  app.use("/uploads", express.static(path.join(root, "uploads")));
  app.get("/", (req, res) => {
    res.sendFile(path.join(root, "dist/client/index.html"));
  });
  app.listen(8000, () => console.log("Server is Spinning on port 8000"));
};
//invoking the startSever
startSever();
