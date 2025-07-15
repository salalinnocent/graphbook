// webpack.client.config.cjs
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const buildDirectory = path.resolve("dist");
const outputDirectory = path.join(buildDirectory, "/client");

module.exports = {
  mode: "development",
  entry: "./src/client/index.js",
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: "bundle.js",
    //no matter what the route user is on, always load assets from the root
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
      },
    ],
  },
  devServer: {
    port: 4000,
    open: true,
    historyApiFallback: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
