const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                path.resolve(__dirname, "plugins/babel-plugin-import.js"), // 按需加载
                { libraryName: "lodash", libraryDirectory: "" },
              ],
            ],
          },
        },
      },
    ],
  },
  devServer: {
    // 额外的静态文件跟目录
    static: path.resolve(__dirname, "public"),
    port: 8080,
    open: true,
  },
  plugins: [new HtmlWebpackPlugin()],
};
