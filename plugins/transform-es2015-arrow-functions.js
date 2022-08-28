const core = require("@babel/core");
const types = require("@babel/types");

const visitor = {
  // 如果是箭头函数，那么就会进来此函数，参数是箭头函数的节点路径对象
  ArrowFunctionExpression(path) {
    let { node } = path;
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
}

module.exports = function () {
  return {
    visitor,
  };
};
