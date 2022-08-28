const types = require("@babel/types");

const visitor = {
  /**
   * 当babel遍历语法树的时候，当遍历到ImportDeclartion节点的时候会执行此函数
   *
   * @param {*} path
   * @param {*} state
   */
  ImportDeclaration(path, state) {
    // 获取对用的node节点
    const { node } = path;
    // 获取 导入的标识符
    const { specifiers } = node;
    // 获取我们在webpack配置文件中配置的参数
    const { libraryName, libraryDirectory = "lib" } = state.opts;
    // 如果导入的库等于配置库的名字，并且当前导入不是默认导入
    if (
      node.source.value === libraryName &&
      !types.isImportDefaultSpecifier(specifiers[0])
    ) {
      const declarations = specifiers.map((specifier) => {
        const source = [
          libraryName,
          libraryDirectory,
          specifiers[0].imported.name,
        ]
          .filter(Boolean)
          .join("/");
        return types.importDeclaration(
          [types.importDefaultSpecifier(specifier.local)],
          types.stringLiteral(source)
        );
      });
      path.replaceWithMultiple(declarations);
    }
  },
};
module.exports = function () {
  return {
    visitor,
  };
};

// path
// node 当前 AST 节点
// parent 父 AST 节点
// parentPath 父AST节点的路径
// scope 作用域
// get(key) 获取某个属性的 path
// set(key, node) 设置某个属性
// is类型(opts) 判断当前节点是否是某个类型
// find(callback) 从当前节点一直向上找到根节点(包括自己)
// findParent(callback)从当前节点一直向上找到根节点(不包括自己)
// insertBefore(nodes) 在之前插入节点
// insertAfter(nodes) 在之后插入节点
// replaceWith(replacement) 用某个节点替换当前节点
// replaceWithMultiple(nodes) 用多个节点替换当前节点
// replaceWithSourceString(replacement) 把源代码转成AST节点再替换当前节点
// remove() 删除当前节点
// traverse(visitor, state) 遍历当前节点的子节点,第1个参数是节点，第2个参数是用来传递数据的状态
// skip() 跳过当前节点子节点的遍历
// stop() 结束所有的遍历