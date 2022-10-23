const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  entry: {
    page1: "./src/page1.js",
    page2: "./src/page2.js",
    page3: "./src/page3.js",
  },
  output: {
    path: path.resolve(__dirname, "dist/split"),
    filename: "[name][chunkhash:8].js",
  },
  optimization: {
    splitChunks: {
      chunks: "all", // initial async all
      minSize: 20000,
      minRemainingSize: 0,
      // The minimum times must a module be shared among chunks before splitting.
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
