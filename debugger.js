const webpack = require("./_webpack");
// const webpack = require("webpack");
const options = require("./webpack.config");

const compiler = webpack(options);
debugger;
compiler.run((err, stats) => {
  console.log(err);
  console.log(
    stats.toJson({
      assets: true, // 本次编译产出的资源
      chunks: true, // 本次编译产出的代码块
      modules: true, // 本次编译产出的模块
    })
  );
});
