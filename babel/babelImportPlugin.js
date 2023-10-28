// babel-plugin-import 实现原理

//babel核心模块
const core = require("@babel/core");
//用来生成或者判断节点的AST语法树的节点
const types = require("@babel/types");

const visitor = {
  ImportDeclaration(path, state) {
    debugger
    const { node } = path; //获取节点
    const { specifiers } = node; //获取批量导入声明数组
    const { libraryName, libraryDirectory = "lib" } = state.opts;
    if (
      libraryName === node.source.value &&
      !types.isImportDefaultSpecifier(specifiers[0])
    ) {
      const declarations = specifiers.map((specifier) => {
        return types.importDeclaration(
          [types.importDefaultSpecifier(specifier.local)],
          types.stringLiteral(
            libraryDirectory
              ? `${libraryName}/${libraryDirectory}/${specifier.imported.name}`
              : `${libraryName}/${specifier.imported.name}`
          )
        );
      });
      path.replaceWithMultiple(declarations); // 替换当前节点
    }
  },
};

module.exports = function () {
  return {
    visitor,
  };
};
