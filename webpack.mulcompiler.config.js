const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = [
  {
    mode: "development",
    entry: {
      mulmain: "./src/mulentry.js",
    },
    output: {
      path: path.resolve(__dirname, "dist/mulentry"),
      filename: "[name].js",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
    ],
  },
  {
    mode: "development",
    entry: {
      mulentry1: "./src/mulentry1.js",
    },
    output: {
      path: path.resolve(__dirname, "dist/mulentry1"),
      filename: "[name].js",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
    ],
  },
];
