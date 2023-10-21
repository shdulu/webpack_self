const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  output: {},
  devServer: {
    port: 3000,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new ModuleFederationPlugin({
      filename: "remoteEntry.js", // 向主机提供服务的文件名 - 构建输出的文件名
      name: "remote", // 必须、输出的模块名，被远程引用时路径为${name}/${exposes}. 本质时通过一个全局变量向外提供服务
      exposes: {
        // 被远程引用时可暴露的资源路径及其别名
        "./BankList": "./src/BankList",
      },
      shared: {
        react: {
          requiredVersion: "^18.2.0",
          singleton: true,
        },
        "react-dom": {
          requiredVersion: "^18.2.0",
          singleton: true,
        },
      },
    }),
  ],
};
