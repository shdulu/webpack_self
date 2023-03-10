// 在compiler编译对象上添加 日志输出、文件操作属性，并注册 beforeRun 钩子

const CachedInputFileSystem = require("enhanced-resolve/lib/CachedInputFileSystem");
const fs = require("graceful-fs");

class NodeEnvironmentPlugin {
  constructor(options) {
    this.options = options || {};
  }
  apply(compiler) {
    // 1. 输出控制台日志
    // compiler对象添加输入文件系统 - 
    compiler.inputFileSystem = new CachedInputFileSystem(fs, 60000);
    const inputFileSystem = compiler.inputFileSystem;
    // compiler 对象添加输出文件系统
    compiler.outputFileSystem = fs;
    compiler.intermediateFileSystem = fs;

    // compiler.watchFileSystem = 文件监听系统
    // 注册 beforeRun 钩子
    compiler.hooks.beforeRun.tap("NodeEnvironmentPlugin", (compiler) => {
      if (compiler.inputFileSystem === inputFileSystem) {
        // 记录编译开始时间
        compiler.fsStartTime = Date.now();
        // 编译前清理文件系统
        inputFileSystem.purge();
      }
    });
  }
}
module.exports = NodeEnvironmentPlugin;
