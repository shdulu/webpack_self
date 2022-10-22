const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackDonePlugin = require("./plugins/webpack-done-plugin");
const WebpackRunPlugin = require("./plugins/webpack-run-plugin");
const WebpackAssetsPlugin = require("./plugins/webpack-assets-plugin");
const webpackArchivePlugin = require("./plugins/webpack-archive-plugin");
const WebpackExternalPlugin = require("./plugins/webpack-external-plugin");
const PreloadWebpackPlugin = require("./plugins/preload-webpack-plugin");
const SpeedMeasureWebpackPlugin = require("speed-measure-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// const PurgecssWebpackPlugin = require("purgecss-webpack-plugin");
// const glob = require("glob");
// const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// const PATHS = {
//   src: path.resolve(__dirname, "src"),
// };
// const smwp = new SpeedMeasureWebpackPlugin();
module.exports = {
  mode: "development",
  entry: {
    entry1: "./src/index.js",
    // entry2: "./src/entry2.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name][chunkhash:8].js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    alias: {},
    modules: ["mymodules", "node_modules"],
  },
  module: {
    noParse: /jquery|lodash/, // 此模块不需要解析它的依赖
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      // {
      //   test: /\.js$/,
      //   use: [
      //     path.resolve(__dirname, "loaders/logger1-loader.js"),
      //     path.resolve(__dirname, "loaders/logger2-loader.js"),
      //   ],
      // },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            // plugins: [
            //   [path.resolve(__dirname, "plugins/babel-logger.js")],
            //   [
            //     path.resolve(__dirname, "plugins/babel-plugin-import.js"), // 按需加载
            //     { libraryName: "lodash", libraryDirectory: "" },
            //   ],
            // ],
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
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(), // 压缩js
    ],
  },
  plugins: [
    new webpack.IgnorePlugin({
      contextRegExp: /moment$/,
      resourceRegExp: /^\.\/locale/,
    }),
    // new MiniCssExtractPlugin({
    //   filename: "static/css/[name][contenthash:8].css",
    // }),
    // new OptimizeCssAssetsPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
    }),
    new WebpackDonePlugin(),
    new WebpackRunPlugin(),
    new WebpackAssetsPlugin(),
    new webpackArchivePlugin(),
    new WebpackExternalPlugin({
      lodash: {
        varName: "_",
        url: "https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.js",
      },
    }),
    // new PurgecssWebpackPlugin({
    //   paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    // }),
    new PreloadWebpackPlugin({
      rel: "preload",
      include: "asyncChunks",
    }),
  ],
}
