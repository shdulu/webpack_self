// babel核心包，用来实现语法树生成、遍历、修改和生成源代码
const core = require("@babel/core");
// 用来生成某些AST节点或者判断某个节点是不是需要个类型
const types = require("@babel/types");
const sourcecode = `const sum = (a, b) => a + b`;
// const sourcecodeAst = {
//   type: "Program",
//   body: [
//     {
//       type: "VariableDeclaration",
//       declarations: [
//         {
//           type: "VariableDeclarator",
//           id: {
//             type: "Identifier",
//             name: "sum",
//           },
//           init: {
//             type: "ArrowFunctionExpression",
//             id: null,
//             params: [
//               {
//                 type: "Identifier",
//                 name: "a",
//               },
//               {
//                 type: "Identifier",
//                 name: "b",
//               },
//             ],
//             body: {
//               type: "BinaryExpression",
//               operator: "+",
//               left: {
//                 type: "Identifier",
//                 name: "a",
//               },
//               right: {
//                 type: "Identifier",
//                 name: "b",
//               },
//             },
//             generator: false,
//             expression: true,
//             async: false,
//           },
//         },
//       ],
//       kind: "const",
//     },
//   ],
//   sourceType: "module",
// };

const transformEs2015ArrowFunctions = {
  visitor: {
    // 访问器 Visitor 上挂载以节点 type 命名的方法，当遍历 AST 的时候，如果匹配上 type，就会执行对应的方法
    ArrowFunctionExpression(path) {
      debugger;
      let { node } = path;
      hoistFunctionEnvironment(path);
      node.type = "FunctionExpression";
      let body = node.body;
      // 如果函数体不是语义块
      if (!types.isBlockStatement(body)) {
        // 快速方便的构造节点
        node.body = types.blockStatement([types.returnStatement(body)]);
      }
    },
  },
};
function hoistFunctionEnvironment(path) {
  // 1. 确定我们要用哪里的this，向上找不是箭头函数的函数或者根节点
  const thisEnv = path.findParent((parent) => {
    return (
      (parent.isFunction() && !path.isArrowFunctionExpression()) ||
      parent.isProgram()
    );
  });

  let thisPaths = getThisPaths(path);
  if (thisPaths.length > 0) {
    let thisBindings = "_this";
    // 在thisEnv这个节点的作用域中添加一个变量  变量名为_this，值为this var _this = this
    if (!thisEnv.scope.hasBinding(thisBindings)) {
      thisEnv.scope.push({
        id: types.identifier(thisBindings),
        init: types.thisExpression(),
      });
    }
    thisPaths.forEach((thisPath) => {
      // this => _this 节点替换
      thisPath.replaceWith(types.identifier(thisBindings));
    });
  }
}
function getThisPaths(path) {
  let thisPaths = [];
  path.traverse({
    ThisExpression(path) {
      thisPaths.push(path);
    },
  });
  return thisPaths;
}
const targetCode = core.transform(sourcecode, {
  plugins: [transformEs2015ArrowFunctions],
});

console.log(targetCode.code);
