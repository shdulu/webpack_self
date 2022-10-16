/**
 * 1.如何获取打包后的文件名和文件内容
 * 2.如果打压缩包
 * 3.如何向目标目录输出压缩包
 *
 * @class WebpackArchivePlugin
 */
const jszip = require("jszip");

class WebpackArchivePlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    // emit 这个钩子是webpack在确定好输出的文件名和文件内容之后，在写入谁的之前触发的，这是最后一个改变输出文件的机会
    compiler.hooks.emit.tap("WebpackArchivePlugin", (compilation) => {
      compilation.hooks.processAssets.tapPromise(
        "WebpackArchivePlugin",
        (assets) => {}
      );
    });
  }
}
module.exports = WebpackArchivePlugin;
