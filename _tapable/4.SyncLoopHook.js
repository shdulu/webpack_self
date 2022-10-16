// 不断的循环从头开始执行，直到每一个函数都返回undefined为止
const { SyncLoopHook } = require("tapable");
const hook = new SyncLoopHook(["name", "age"]);
let counter1 = 0;
let counter2 = 0;
let counter3 = 0;

// 如果回调函数返回了 undefined 就继续往下执行，如果不是，就继续从头循环执行
hook.tap("1", () => {
  console.log(1, "counter1", counter1);
  if (++counter1 === 1) {
    counter1 = 0;
    return;
  }
  return true
});

hook.tap("2", () => {
  console.log(2, "counter2", counter2);
  if (++counter2 === 2) {
    counter2 = 0;
    return;
  }
  return true
});

hook.tap("3", () => {
  console.log(3, "counter3", counter3);
  if (++counter3 === 3) {
    counter3 = 0;
    return;
  }
  return true
});

hook.call("shdulu", 30);
