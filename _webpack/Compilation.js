const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const types = require("@babel/types");
const { type } = require("os");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

function toUnixPath(path) {
  return path.replace(/\\/g, "/");
}
const baseDir = toUnixPath(process.cwd());

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
      const entryFilePath = path.posix.join(baseDir, entry[entryName]); // "d:/myProject/webpack/webpack6/src/index.js"
      // 把入口文件的绝对路径添加到依赖数组中
      this.fileDependencies.push(entryFilePath);
      let entryModule = this.buildModule(entryName, entryFilePath);
    }
  }
  buildModule(name, modulePath) {
    // 6. 从入口文件出发，调用所有配置的规则，比如说 loader 对模块进行编译
    // 6.1 读取模块内容
    let sourceCode = fs.readFileSync(modulePath, "utf8");
    // buildModule 返回一个模块对象，每个模块都会有一个moduleId
    let moduleId = "./" + path.posix.relative(baseDir, modulePath); // './src/index.js'
    // 创建一个模块对象
    let module = {
      id: moduleId, // './src/index.js'
      names: [name], // ['entry1']
      dependencies: [],
    };
    // 查找对应的loader，对源码进行编译和转换
    let loaders = [];
    let { rules = [] } = this.options.module;
    rules.forEach((rule) => {
      let { test } = rule;
      // 如果模块的路径和正则匹配，就把此规则对应的loader添加到loader数组中
      if (modulePath.match(test)) {
        loaders.push(...rule.use);
      }
    });
    // 从右向左对模块进行转译
    sourceCode = loaders.reduceRight((sourceCode, loader) => {
      return require(loader)(sourceCode);
    }, sourceCode);
    // 通过 loader 编译后的内容一定是js内容
    // 7. 再找出此模块的依赖的模块，在递归本步骤找到依赖的模块进行编译
    const ast = parser.parse(sourceCode, {
      sourceType: "module",
    });

    traverse(ast, {
      CallExpression: ({ node }) => {
        if (node.callee.name === "require") {
          // 获取依赖的模块
          let depModuleName = node.arguments[0].value;
          // 当前正在编译的模块所在的目录
          let dirname = path.posix.dirname(modulePath);
          // 获取依赖模块的绝对路径
          let depModulePath = path.posix.join(dirname, depModuleName);
          
          let extensions = this.options.resolve.extensions;
          // 尝试添加后缀，找到一个真实在硬盘上存在的文件
          depModulePath = tryExtensions(depModulePath, extensions);
          this.fileDependencies.push(depModulePath);
          // 获取依赖的模块id
          let depModuleId = "./" + path.posix.relative(baseDir, depModulePath);
          // 修改语法树，把依赖的模块改为依赖的模块id
          node.arguments = [types.stringLiteral(depModuleId)];
          // 添加依赖
          module.dependencies.push({ depModuleId, depModulePath });
        }
      },
    });
    // 重新生成新的代码
    let { code } = generator(ast);
    // 把转译后的源代码放到 module._source 属性上
    module._source = code;
    // 在递归本步骤找到依赖的模块进行编译
    module.dependencies.forEach(({ depModuleId, depModulePath }) => {
      let existModule = this.modules.find((item) => item.id === depModuleId);
      // 如果modules里已经存在这个将要编译的依赖模块，那么就不需要编译了
      if (existModule) {
        existModule.names.push(name);
      } else {
        let depModule = this.buildModule(name, depModulePath);
        this.modules.push(depModule);
      }
    });
    return module;
  }
}
function tryExtensions(modulePath, extensions) {
  if (fs.existsSync(modulePath)) {
    return modulePath;
  }
  for (let i = 0; i < extensions.length; i++) {
    let filePath = modulePath + extensions[i];
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  throw new Error(`无法找到${modulePath}`);
}
module.exports = Compilation;
