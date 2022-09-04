const path = require('path')
class Compilation {
  constructor(options) {
    this.options = options;
    // 本地编译所有生成出来的模块
    this.modules = [];
    // 本次编译 产出的所有代码块 入口模块和依赖的模块打包在一起成为代码块
    this.chunks = [];
    // 本次编译产出的资源文件
    this.assets = {};
    // 本次打包涉及了那些文件，主要是为了实现watch，监听文件的变化，文件发生变化后会重新进行编译
    this.fileDependencies = [];
  }
  build() {
    // 5. 根据配置文件中的`entry`配置项找到入口文件
    let entry = {};
    if (typeof this.options.entry === "string") {
      entry.main = this.options.entry;
    } else {
      entry = this.options.entry;
    }
    // 6. 从入口文件出发，调用所有配置的规则，比如说 loader 对模块进行编译
    for (const entryName in entry) {
      // 入口的名称就是entry的属性名，也将会成为代码块的名称
      let entryFilePath = path.posix.join()
    }
  }
}
module.exports = Compilation;
