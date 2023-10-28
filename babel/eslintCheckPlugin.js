/**
 * eslint 代码检查插件，不允许出现console.log()
 *
 * */
const core = require("@babel/core");
const types = require("@babel/types");
const template = require("@babel/template");

const sourcecode = `
var a = 1;
console.log(a);
var b = 2;
`;

const eslintCheckPlugin = (options) => {
  return {
    // 在 AST 遍历之前执行的逻辑
    pre(file) {
      // 遍历前
      file.set("errors", []);
    },
    visitor: {
      CallExpression(path, state) {
        const { node } = path;
        const errors = state.file.get("errors");
        if (node.callee.object && node.callee.object.name === "console") {
          // 构建一个错误语言
          Error.stackTraceLimit = 0;
          errors.push(
            path.buildCodeFrameError(`代码中不能出现console.log语句！`)
          );
          if (options.fix) {
            path.parentPath.remove();
          }
        }
      },
    },
     // 在 AST 遍历之后执行的逻辑
    post(file) {
      console.log(file.get("errors"));
    },
  };
};

const result = core.transform(sourcecode, {
  plugins: [eslintCheckPlugin({ fix: true })],
});
console.log(result.code);
