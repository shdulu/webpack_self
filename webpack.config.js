const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackDonePlugin = require("./plugins/webpack-done-plugin");
const WebpackRunPlugin = require("./plugins/webpack-run-plugin");

module.exports = {
  mode: "development",
  entry: {
    entry1: "./src/index.js",
    entry2: "./src/entry2.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        use: [
          path.resolve(__dirname, "loaders/logger1-loader.js"),
          path.resolve(__dirname, "loaders/logger2-loader.js"),
        ],
      },
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: "babel-loader",
      //     options: {
      //       presets: ["@babel/preset-env"],
      //       plugins: [
      //         [path.resolve(__dirname, "plugins/babel-logger.js")],
      //         [
      //           path.resolve(__dirname, "plugins/babel-plugin-import.js"), // 按需加载
      //           { libraryName: "lodash", libraryDirectory: "" },
      //         ],
      //       ],
      //     },
      //   },
      // },
    ],
  },
  devServer: {
    // 额外的静态文件跟目录
    static: path.resolve(__dirname, "public"),
    port: 8080,
    open: true,
  },
  plugins: [
    // new HtmlWebpackPlugin(),
    new WebpackDonePlugin(),
    new WebpackRunPlugin(),
  ],
};
