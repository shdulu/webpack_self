const core = require("@babel/core");
const types = require("@babel/types");

const visitor = {
  // 如果是箭头函数，那么就会进来此函数，参数是箭头函数的节点路径对象
  ArrowFunctionExpression(path) {
    let { node } = path; // 当前AST节点
    hoistFunctionEnvironment(path);
    node.type = "FunctionExpression";
    let body = node.body;
    // 如果函数体不是语句块
    if (!types.isBlockStatement(body)) {
      node.body = types.blockStatement([types.returnStatement(body)]);
    }
  },
};
/**
 * 1.要在函数的外面声明一个_this变量，值是this
 * 2.在函数的内容，换this 变成_this
 * @param {*} path
 */
function hoistFunctionEnvironment(path) {
  // 1.确定我要用哪里的this 向上找不是箭头函数的函数或者根节点
  const thisEnv = path.findParent((parent) => {
    return (
      (parent.isFunction() && !path.isArrowFunctionExpression()) ||
      parent.isProgram()
    );
  });
  const thisPaths = getThisPaths(path);
  if (thisPaths.length > 0) {
    // 在thisEnv这个节点的作用域中添加一个变量  变量名为_this，值为this var _this = this
    const thisBindings = "_this";
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
  // 把用到this变量的路径收集起来
  let thisPaths = [];
  path.traverse({
    ThisExpression(path) {
      thisPaths.push(path);
    },
  });
  return thisPaths;
}
const transformEs2015ArrowFunction = {
  visitor,
};

const sourceCode = `const sum = (a, b) => {
  console.log(this)
  const minus = (a, b) => {
    console.log(this)
  }
  return a + b
}`;
const targetCode = core.transform(sourceCode, {
  plugins: [
    [
      transformEs2015ArrowFunction,
      {
        name: "shdulu",
        age: 10,
      },
    ],
  ],
});

console.log(targetCode.code);

module.exports = () => {
  return {
    visitor,
  };
};
