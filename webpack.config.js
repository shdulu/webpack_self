const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackDonePlugin = require("./plugins/webpack-done-plugin");
const WebpackRunPlugin = require("./plugins/webpack-run-plugin");
const WebpackAssetsPlugin = require("./plugins/webpack-assets-plugin");
const webpackArchivePlugin = require("./plugins/webpack-archive-plugin");
const WebpackExternalPlugin = require("./plugins/webpack-external-plugin");

module.exports = {
  mode: "development",
  entry: {
    entry1: "./src/index.js",
    // entry2: "./src/entry2.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },
  // 配置模块外链，原理不再打包对应 lodash 模块，而是从window._ 上引入
  // externals: {
  //   lodash: "_",
  // },
  module: {
    rules: [
      // {
      //   test: /\.css$/,
      //   use: ["style-loader", "css-loader"],
      // },
      // {
      //   test: /\.js$/,
      //   use: [
      //     path.resolve(__dirname, "loaders/logger1-loader.js"),
      //     path.resolve(__dirname, "loaders/logger2-loader.js"),
      //   ],
      // },
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
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    // new WebpackDonePlugin(),
    // new WebpackRunPlugin(),
    // new WebpackAssetsPlugin(),
    // new webpackArchivePlugin(),
    new WebpackExternalPlugin({
      lodash: {
        varName: "_",
        url: "https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.js",
      },
    }),
  ],
};
