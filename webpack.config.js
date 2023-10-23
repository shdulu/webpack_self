const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackDonePlugin = require("./plugins/webpack-done-plugin");
const WebpackRunPlugin = require("./plugins/webpack-run-plugin");
const WebpackAssetsPlugin = require("./plugins/webpack-assets-plugin");
// const webpackArchivePlugin = require("./plugins/webpack-archive-plugin");
const WebpackExternalPlugin = require("./plugins/webpack-external-plugin");
const PreloadWebpackPlugin = require("./plugins/preload-webpack-plugin");
// const { SkeletonPlugin } = require("./plugins/skeleton/index");
// const SpeedMeasureWebpackPlugin = require("speed-measure-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// const PurgecssWebpackPlugin = require("purgecss-webpack-plugin");
// const glob = require("glob");
// const PATHS = {
//   src: path.resolve(__dirname, "src"),
// };
// const smwp = new SpeedMeasureWebpackPlugin();
module.exports = {
  mode: "development",
  entry: {
    app: path.join(__dirname, "./src/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name][chunkhash:8].js",
    assetModuleFilename: "assets/[hash][ext]",
    clean: true,
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    alias: {},
    modules: ["node_modules"],
  },
  module: {
    noParse: /lodash/, // 此模块不需要解析它的依赖
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
      },
      {
        test: /\.png$/, // 会把png图片自动拷贝到输出目录中，并返回新路径
        type: "asset/resource",
      },
      {
        test: /\.jpg$/, // 会把png图片自动拷贝到输出目录中，并返回新路径
        type: "asset", // 表示可以根据条件自动选择
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024, // 文件大小小于4k走inline，否则走resource
          },
        },
      },
      {
        test: /\.ico$/, // 会把 ico 文件变成base64字符串并返回给调用者
        type: "asset/inline",
      },
      {
        test: /\.txt$/, // 会把txt文件内容返回
        type: "asset/source",
      },
      // {
      //   test: /\.js$/,
      //   use: [
      //     path.resolve(__dirname, "loaders/logger1-loader.js"),
      //     path.resolve(__dirname, "loaders/logger2-loader.js"),
      //   ],
      // },
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
    // new SkeletonPlugin({
    //   staticDir: path.resolve(__dirname, "dist"),
    //   port: 8000,
    //   origin: "http://localhost:8000",
    //   device: "iPhone 6",
    //   image: {
    //     color: "#EFEFEF",
    //   },
    //   button: {
    //     color: "#EFEFEF",
    //   },
    // }),
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
    // new webpackArchivePlugin(),
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
};
