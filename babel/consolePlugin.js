const core = require("@babel/core");
const types = require("@babel/types");
const nodePath = require("path");

const logReportPlugin = {
  visitor: {
    /**
     *
     *
     * @param {*} path 当前正在处理的语法节点,这个参数包含了节点的详细信息，例如节点类型、属性等。
     * @param {*} state 表示插件的状态对象，可以用于共享信息或在不同节点之间传递数据。
     */
    CallExpression(path, state) {
      const { node } = path;
      if (types.isMemberExpression(node.callee)) {
        if (node.callee.object.name === "console") {
          if (
            ["log", "info", "warn", "error", "debug"].includes(
              node.callee.property.name
            )
          ) {
            // 获取console.log 节点所在的行和列
            const { line, column } = node.loc.start;
            const filename = nodePath.relative(
              __dirname,
              state.file.opts.filename
            );
            debugger
            // console.log('hello') 参数列表前面插入新的日志参数
            node.arguments.unshift(
              types.stringLiteral(`${filename} line: ${line} column: ${column}`)
            );
          }
        }
      }
    },
  },
};

const sourcecode = `console.log('hello')`;

const result = core.transform(sourcecode, {
  filename: "main.js",
  plugins: [logReportPlugin],
});
console.log(result.code);
