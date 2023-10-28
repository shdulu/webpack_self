const path = require("path");
module.exports = {
  mode: "development",
  entry: "./src/babel.index.js",
  output: {
    path: path.resolve("dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [
              [
                // "babel-plugin-import",
                path.resolve(__dirname, 'babel/babelImportPlugin.js'),
                {
                  libraryName: "lodash",
                  libraryDirectory: "",
                },
              ],
            ],
          },
        },
      },
    ],
  },
};
