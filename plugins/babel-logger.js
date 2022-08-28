const types = require("@babel/types");
const path = require("path");

const visitor = {
  CallExpression(nodePath, state) {
    const { node } = nodePath;
    if (types.isMemberExpression(node.callee)) {
      if (node.callee.object.name === "console") {
        if (
          ["log", "debug", "info", "error", "warn"].includes(
            node.callee.property.name
          )
        ) {
          const { line, column } = node.loc.start;
          const filename = path
            .relative(path.resolve('.'), state.file.opts.filename).replace(/\\/g, '/')
          node.arguments.unshift(
            types.stringLiteral(`${filename} line: ${line} column: ${column}`)
          );
        }
      }
    }
  },
};

module.exports = function () {
  return {
    visitor,
  };
};
