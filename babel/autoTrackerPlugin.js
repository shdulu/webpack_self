const core = require("@babel/core");
const types = require("@babel/types");
const importModle = require("@babel/helper-module-imports");
const template = require("@babel/template");

const sourcecode = `
function sum(a, b) {
    return a + b;
}
const multiply = function(a, b) {
    return a * b;
}
const minus = (a, b) => a -b;
class Calculator {
    divide(a, b) {
        return a / b;
    }
}
`;

const autoTrackerPlugin = (options) => {
  return {
    // 访问者: 包含了一组方法，每个方法对应一个不同类型的语法节点
    visitor: {
      Program: {
        enter(path, state) {
          let loggerId;
          path.traverse({
            ImportDeclaration(path) {
              const importedModuleName = path.get("source").node.value;
              if (importedModuleName === options.name) {
                const specifiersPath = path.get("specifiers.0");
                if (
                  specifiersPath.isImportDefaultSpecifier() ||
                  specifiersPath.isImportSpecifier() || // 解构导入
                  specifiersPath.ImportNamespaceSpecifier() // 命名空间导入
                ) {
                  loggerId = specifiersPath.node.local.name;
                }
                path.stop(); // 不在遍历，跳过后续所有的查找和遍历
              }
            },
          });
          // 遍历完了还是没有
          // import logger from 'logger';

          if (!loggerId) {
            loggerId = importModle.addDefault(path, options.name, {
              nameHint: path.scope.generateUid(options.name),
            });
          }

          // template 返回一个语法树节点
          //
          state.loggerNode = template.statement(`LOGGER();`)({
            LOGGER: loggerId,
          });
        },
      },
      "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression|ClassMethod"(
        path,
        state
      ) {
        const { node } = path;

        debugger;
        if (node.id && options.whiteLists.includes(node.id.name)) {
          // 函数声明才会有
          if (types.isBlockStatement(node.body)) {
            node.body.body.unshift(state.loggerNode);
          } else {
            const newNode = types.blockStatement([
              state.loggerNode,
              types.expressionStatement(node.body),
            ]);
            path.get("body").replaceWith(newNode);
          }
        }
      },
    },
  };
};

const result = core.transform(sourcecode, {
  plugins: [
    autoTrackerPlugin({
      name: "logger",
      whiteLists: ["sum"],
      blackLists: ["black"],
    }),
  ],
});
console.log(result.code);
