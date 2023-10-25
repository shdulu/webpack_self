const esprima = require("esprima"); // 把js源代码转成抽象语法树
const estraverse = require("estraverse"); // 遍历抽象语法树
const escodegen = require("escodegen"); // 把语法树重新生成源代码

const sourceCode = `function ast() {console.log('this is a ast tree')}`;
debugger;

const AST = esprima.parseModule(sourceCode);

// AST = {
//   type: "Program",
//   body: [
//     {
//       type: "FunctionDeclaration",
//       id: {
//         type: "Identifier",
//         name: "ast",
//       },
//       params: [],
//       body: {
//         type: "BlockStatement",
//         body: [],
//       },
//       generator: false,
//       expression: false,
//       async: false,
//     },
//   ],
//   sourceType: "module",
// };

/**
 * 深度优先遍历
 *
 * */
estraverse.traverse(AST, {
  enter(node) {
    console.log("进入" + node.type);
    if (node.type === "FunctionDeclaration" && node.id.name === "ast") {
      // 修改函数名称
      node.id.name = "astFn";
    }
  },
  leave(node) {
    console.log("离开" + node.type);
  },
});

const resultCode = escodegen.generate(AST)
console.log(resultCode)