const webpack = require("./_webpack");
// const webpack = require("./webpack_self");
const options = require("./webpack.config");

debugger;
const compiler = webpack(options);
debugger;
compiler.run((err, stats) => {
  console.log(err);
  console.log(
    stats.toJson({
      entries: true, // 所有入口对象
      chunks: true, // 所有的chunk代码块
      modules: true, // 所有模块
      assets: true, // 本次编译产出的资源 也就是 bundle 文件
    })
  );
});
