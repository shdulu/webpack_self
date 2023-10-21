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
    port: 8000,
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
      remotes: {
        remote: "remote@http://localhost:3000/remoteEntry.js",
      },
      shared: {
        react: '^18.2.0',
        "react-dom": '^18.2.0',
      },
    }),
  ],
};
