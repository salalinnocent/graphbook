import winston from "winston";


const transports = [
  //a file where errors are saved
  new winston.transports.File({
    filename: "error.log",
    level: "error",
  }),
  //a file where all the logs/messages & info are saved
  new winston.transports.File({
    filename: "combined.log",
    level: "verbose",
  }),
];
if (process.env.NODE_ENV !== "production") {
  transports.push(new winston.transports.Console());
}
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports,
});
export default logger;
