const colors = require("colors/safe");
class WebpackDonePlugin {
  apply(compiler) {
    compiler.hooks.done.tap("WebpackDonePlugin", () => {
      console.log(colors.blue("触发了 WebpackDonePlugin 钩子事件"));
    });
  }
}

module.exports = WebpackDonePlugin;
