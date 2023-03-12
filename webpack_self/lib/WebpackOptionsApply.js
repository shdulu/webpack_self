const EntryOptionPlugin = require("./EntryOptionPlugin");
/**
 * 挂载各种内置插件
 *
 * @class WebpackOptionsApply
 */
class WebpackOptionsApply {
  process(options, compiler) {
    compiler.outputPath = options.output.path;
    compiler.recordsInputPath = options.recordsInputPath || null;
    compiler.recordsOutputPath = options.recordsOutputPath || null;
    compiler.name = options.name;

    // 注册EntryOptionPlugin插件
    new EntryOptionPlugin().apply(compiler);
    // 触发entryOption钩子 context 也就是根目录的路径 entry 入口文件
    compiler.hooks.entryOption.call(options.context, options.entry);
  }
}

module.exports = WebpackOptionsApply;
