const core = require("@babel/core");
const path = require("path");

function loader(source, inputSourceMap) {
  // this loader 函数执行的时候的this指针，指向loaderContext对象
  // webpack5 内置了this.getOptions
  const filename = this.resourcePath.split(path.sep).pop();
  const options = this.getOptions();
  const loaderOptions = {
    ...options,
    inputSourceMap, // 上一个loader传递过来的它的sourcemap
    sourceMaps: true, // 会基于上一个sourcemap 生成自己的sourcemap
    filename,
  };
  console.log("babel-loader", loaderOptions);
  // code 转译后的代码
  // map 源代码和转译后代码的映射文件
  // ast 抽象语法树
  let { code, map, ast } = core.transformSync(source, options);
  console.log('map---', map);
  // this.callback 同步向下一个loader传递参数
  this.callback(null, code, map, ast);
}

module.exports = loader;

/**
 * babel-loader 只是提供一个转换函数，但是并不知道要干啥要转啥
 * @babel/core 负责把源代码转成AST, 然后遍历AST,然后重新生成新的代码，但是它并不知道如何转换语法，它并不认识剪头函数，也不知道如何转换
 * @babel/transform-arrow-functions 插件其实是一个访问器，它知道如何转换AST 语法树，因为要转换的语法太多，所以把一堆插件打包在一起，成为预设 preset-env
 *
 * */
