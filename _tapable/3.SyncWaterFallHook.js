const { SyncWaterfallHook } = require("tapable");
// 同步瀑布
const hook = new SyncWaterfallHook(["name", "age"]);

hook.tap("1", (name, age) => {
  console.log(1, name, age);
  return "1"; // 返回值会给到下一个函数的第一个参数
});

hook.tap("2", (name, age) => {
  console.log(2, name, age);
  return "2"; // 有返回值跳过后面的函数执行
});

hook.tap("3", (name, age) => {
  console.log(3, name, age);
});

hook.call("shdulu", 30);
