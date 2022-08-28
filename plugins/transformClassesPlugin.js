const core = require("@babel/core");
const types = require("@babel/types");

const transformClassesPlugin = {
  visitor: {
    ClassDeclaration(path) {
      const node = path.node;
      const id = node.id; //Identifier name:Person
      const methods = node.body.body; //Array<MethodDefinition>
      let nodes = [];
      methods.forEach((method) => {
        if (method.kind === "constructor") {
          let constructorFunction = types.functionDeclaration(
            id,
            method.params,
            method.body,
            method.generator,
            method.async
          );
          nodes.push(constructorFunction);
        } else {
          let memberExpression = types.memberExpression(
            types.memberExpression(id, types.identifier("prototype")),
            method.key
          );
          let functionExpression = types.functionExpression(
            null,
            method.params,
            method.body
          );
          let assignmentExpression = types.assignmentExpression(
            "=",
            memberExpression,
            functionExpression
          );
          nodes.push(assignmentExpression);
        }
      });
      if (nodes.length === 1) {
        //单节点用replaceWith
        //path代表路径，用nodes[0]这个新节点替换旧path上现有老节点node ClassDeclaration
        path.replaceWith(node[0]);
      } else {
        //多节点用replaceWithMultiple
        path.replaceWithMultiple(nodes);
      }
    },
  },
};

let sourceCode = `class Person{
  constructor(name){
      this.name = name;
  }
  sayName(){
      console.log(this.name);
  }
}`;
let targetSource = core.transform(sourceCode, {
  plugins: [transformClassesPlugin],
});

console.log(targetSource.code);
