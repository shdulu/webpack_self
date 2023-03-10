const Compiler = require("./Compiler");
const NodeEnvironmentPlugin = require("./node/NodeEnvironmentPlugin");
const { getNormalizedWebpackOptions } = require("./config/normalization");
const {
  applyWebpackOptionsBaseDefaults,
  applyWebpackOptionsDefaults,
} = require("./config/defaults");

/**
 * @param {*} rawOptions options object
 * @returns {Compiler} a compiler
 */
const createCompiler = (rawOptions) => {
  // 规范化options 配置项
  const options = getNormalizedWebpackOptions(rawOptions);
  // TODO - 基础配置
  applyWebpackOptionsBaseDefaults(options);
  // 创建一个 compiler 实例编译对象
  const compiler = new Compiler(options.context, options);
  // 注册 compiler 环境变量
  new NodeEnvironmentPlugin(options).apply(compiler);
  // 循环遍历插件配置项 - 挂载插件
  if (Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
      if (typeof plugin === "function") {
        plugin.call(compiler, compiler);
      } else {
        plugin.apply(compiler);
      }
    }
  }
  // TODO - 默认配置
  applyWebpackOptionsDefaults(options);
  // ???
  compiler.hooks.environment.call();
  compiler.hooks.afterEnvironment.call();
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
    let compiler;
    let watch = false;
    let watchOptions;
    if (Array.isArray(options)) {
      // 这里惊呆了 webpack 竟然可以支持配置成一个数组 - TODO
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
