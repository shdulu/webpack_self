const core = require("@babel/core");
// const loaderUtils = require("loader-utils");

function loader(source) {
  // this loader 函数执行的时候的this指针，指向loaderContext对象
  // webpack5 内置了this.getOptions
  const options = this.getOptions();
  console.log("babel-loader", options);
  // code 转译后的代码
  // map 源代码和转译后代码的映射文件
  // ast 抽象语法树
  let { code, map, ast } = core.transform(source, options);
  // this.callback 同步向下一个loader传递参数
  // this.callback(null, code, map, ast);
  console.log("babel-loader........", code, map, ast);
  return source;
}

module.exports = loader;

/**
 * babel-loader 只是提供一个转换函数，但是并不知道要干啥要转啥
 * @babel/core 负责把源代码转成AST, 然后遍历AST,然后重新生成新的代码，但是它并不知道如何转换语法，它并不认识剪头函数，也不知道如何转换
 * @babel/transform-arrow-functions 插件其实是一个访问器，它知道如何转换AST 语法树，因为要转换的语法太多，所以把一堆插件打包在一起，成为预设 preset-env
 *
 * */
