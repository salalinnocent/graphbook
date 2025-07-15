const path = require("path");

//styleguide.config
module.exports = {
  components: "src/client/components/**/*.js",
  require: [path.join(__dirname, "src/assets/css/style.css")],
  webpackConfig: require("./webpack.client.config.cjs"),
  serverPort: 7000,
};
