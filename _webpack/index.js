const colors = require("colors/safe");
const Compiler = require("./Compiler");

function webpack(options) {
  // 1. 初始化参数，从配置文件和 shell 语句中读取合并参数，并得到最终的配置对象
  const argv = process.argv.slice(2);
  const shellOptions = argv.reduce((config, args) => {
    let [key, value] = args.split("=");
    config[key.slice(2)] = value;
    return config;
  }, {});
  const finalOptions = { ...options, ...shellOptions };
  console.log(colors.green("1.初始化参数配置：", finalOptions));

  // 2. 用上一步的对象初始化 `Compiler` 对象
  const compiler = new Compiler(finalOptions);
  // 3. 加载所有配置的插件
  const { plugins } = finalOptions;
  if (plugins && Array.isArray(plugins)) {
    for (const plugin of plugins) {
      plugin.apply(compiler); // 调用插件 apply 方法注册事件
    }
  }
  return compiler;
}

module.exports = webpack;
