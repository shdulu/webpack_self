const {
  SyncHook,
  SyncBailHook,
  AsyncParallelHook,
  AsyncSeriesHook,
} = require("tapable");

class Compiler {
  /**
   * @param {string} context the compilation path
   * @param {WebpackOptions} options options
   */
  constructor(context, options) {
    this.hooks = Object.freeze({
      done: new AsyncSeriesHook(["stats"]),
      afterDone: new SyncHook(["stats"]),
      beforeRun: new AsyncSeriesHook(["compiler"]),
      environment: new SyncHook([]),
      afterEnvironment: new SyncHook([]),
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
    console.log('Compiler run')
  }
}

module.exports = Compiler;
