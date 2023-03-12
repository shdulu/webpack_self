const Compiler = require("./Compiler");
const NodeEnvironmentPlugin = require("./node/NodeEnvironmentPlugin");
const WebpackOptionsApply = require('./WebpackOptionsApply')
const { getNormalizedWebpackOptions } = require("./config/normalization");
const {
  applyWebpackOptionsBaseDefaults,
  applyWebpackOptionsDefaults,
} = require("./config/defaults");

/**
 * @param {WebpackOptions} rawOptions options object
 * @returns {Compiler} a compiler
 */
const createCompiler = (rawOptions) => {
  const options = getNormalizedWebpackOptions(rawOptions); // TODO - 规范化options 配置项
  applyWebpackOptionsBaseDefaults(options); // TODO - 设置基础配置项
  // 实例化一个 compiler 编译对象
  const compiler = new Compiler(options.context, options);
  // 编译器 compiler 环境变量设置
  new NodeEnvironmentPlugin(options).apply(compiler);
  // 循环遍历插件配置项 - 初始化插件
  if (Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
      if (typeof plugin === "function") {
        plugin.call(compiler, compiler);
      } else {
        plugin.apply(compiler);
      }
    }
  }
  applyWebpackOptionsDefaults(options); // TODO - 设置默认配置
  // 调用 environment、afterEnvironment 钩子函数
  compiler.hooks.environment.call();
  compiler.hooks.afterEnvironment.call();
  debugger
  new WebpackOptionsApply().process(options, compiler)
  // 完成编译器对象初始化调用 initialize 钩子函数
  compiler.hooks.initialize.call()
  return compiler;
};

/**
 *
 *
 * @param {*} options
 * @param {*} callback
 * @return {*}
 */
const webpack = (options, callback) => {
  const create = () => {
    // TODO - validate
    let compiler;
    let watch = false;
    let watchOptions;
    if (Array.isArray(options)) {
      // 惊呆了老铁 webpack 竟然可以支持配置成一个数组 - TODO
    } else {
      const webpackOptions = options;
      compiler = createCompiler(webpackOptions);
      watch = webpackOptions.watch;
      watchOptions = webpackOptions.watchOptions || {};
    }
    return { compiler, watch, watchOptions };
  };
  if (callback) {
    //
  } else {
    const { compiler, watch } = create();
    return compiler;
  }
};

module.exports = webpack;
