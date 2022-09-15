const less = require("less");
function loader(lessContent) {
  // 1. 把loader的执行从同步变成异步
  // 2. 返回callback
  let callback = this.async();
  // render 同步执行
  less.render(
    lessContent,
    {
      filename: this.resource,
    },
    (err, output) => {
      // 1. 返回css文本
      console.log("less-loader_return:", output.css);
      // callback(err, output.css);

      // 2. 左侧loader联用
      callback(err, `module.exports = ${JSON.stringify(output.css)}`)
    }
  );
}

module.exports = loader;
