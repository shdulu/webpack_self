const { SyncBailHook } = require("tapable");
// 同步保险
const hook = new SyncBailHook(["name", "age"]);

hook.tap("1", (name, age) => {
  console.log(1, name, age);
});

hook.tap("2", (name, age) => {
  console.log(2, name, age);
  return 2; // 有返回值跳过后面的函数执行
});

hook.tap("3", (name, age) => {
  console.log(3, name, age);
});

hook.call("shdulu", 12);
