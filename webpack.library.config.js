const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  entry: {
    main: "./src/library.js",
  },
  output: {
    path: path.resolve(__dirname, "dist/library"),
    filename: "[name].js",
    library: "Calculator", // 打包成库的名称
    // libraryExport: 'add',
    libraryTarget: 'commonjs2', // 打包库的以何种模块规范方式导出
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
