const {
  SyncHook,
  SyncBailHook,
  AsyncParallelHook,
  AsyncSeriesHook,
} = require("tapable");

/**
 * 文档地址: https://www.webpackjs.com/api/compiler-hooks/
 * 1. 监听机制,并且在文件修改时重新编译。 当处于监听模式(watch mode)时，compiler 会触发诸如 watchRun, watchClose 和 invalid 等额外的事件。 通常在 开发环境 中使用， 也常常会在 webpack-dev-server 这些工具的底层调用， 由此开发人员无须每次都使用手动方式重新编译
 * 2. 注册生命周期钩子函数，对外暴露
 * 3. 单例模式，webpack 编译过程中仅会实例化一个 compiler 对象
 *
 * @class Compiler
 */
class Compiler {
  /**
   * @param {string} context the compilation path
   * @param {WebpackOptions} options options
   */
  constructor(context, options) {
    this.hooks = Object.freeze({
      initialize: new SyncHook([]), // 当编译器对象被初始化时调用
      done: new AsyncSeriesHook(["stats"]),
      afterDone: new SyncHook(["stats"]),
      beforeRun: new AsyncSeriesHook(["compiler"]),
      environment: new SyncHook([]), // 在编译器准备环境时调用，时机就在配置文件中初始化插件之后
      make: new AsyncParallelHook(["compilation"]),
      afterEnvironment: new SyncHook([]), // 当编译器环境设置完成后，在 environment hook 后直接调用
      thisCompilation: new SyncHook(["compilation", "params"]),
      compilation: new SyncHook(["compilation", "params"]),
      entryOption: new SyncBailHook(["context", "entry"]), // 在 webpack 选项中的 entry 被处理过之后调用
    });
  }
  /**
   * 开始编译的入口
   *
   * @param {Callback<Stats>} callback signals when the call finishes
   * @memberof Compiler
   * @returns {void}
   */
  run(callback) {
    console.log("Compiler run");
  }
}

module.exports = Compiler;
