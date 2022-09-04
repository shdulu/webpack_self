const colors = require("colors/safe");
class WebpackRunPlugin {
  apply(compiler) {
    compiler.hooks.run.tap("WebpackRunPlugin", () => {
      console.log(colors.blue("触发了 WebpackRunPlugin 钩子事件"));
    });
  }
}

module.exports = WebpackRunPlugin;
