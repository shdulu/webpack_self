// babel核心包，用来实现语法树生成、遍历、修改和生成源代码
const core = require("@babel/core");
// 用来生成某些AST节点或者判断某个节点是不是需要个类型
const types = require("@babel/types");

// const sourcecode = `const sum = (a, b) => {
//   console.log(this)
//   const minus = (a,b) => {
//     console.log(this)
//   }
//   return a + b
// }`;

const sourcecode = `const sum = (a, b) => a + b`;

const transformEs2015ArrowFunctions = {
  visitor: {
    // 访问器
    ArrowFunctionExpression(path) {
      let { node } = path;
      hoistFunctionEnvironment(path);
      node.type = "FunctionExpression";
      let body = node.body;
      // 如果函数体不是语义块
      if (!types.isBlockStatement(body)) {
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
      // this => _this
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
  // plugins: ["transform-es2015-arrow-functions"],
  plugins: [transformEs2015ArrowFunctions],
});

console.log(targetCode.code);
