
const { AsyncParallelHook } = require("tapable");
// 异步并行钩子: 同时开始，最后完成的结束，才结束
const hook = new AsyncParallelHook(["name", "age"]);

// 同步注册
// hook.tap("1", (name, age) => {
//   console.log(1, name, age);
//   return "1";
// });

// hook.tap("2", (name, age) => {
//   console.log(2, name, age);
// });

// hook.tap("3", (name, age) => {
//   console.log(3, name, age);
// });

// hook.callAsync("shdulu", 30, (err) => {
//   console.log(err);
// });

// console.time("cost");
// hook.tapAsync("1", (name, age, callback) => {
//   setTimeout(() => {
//     console.log(1, name, age);
//     callback();
//   }, 1000);
// });

// hook.tapAsync("2", (name, age, callback) => {
//   setTimeout(() => {
//     console.log(2, name, age);
//     callback();
//   }, 2000);
// });

// hook.tapAsync("3", (name, age, callback) => {
//   setTimeout(() => {
//     console.log(3, name, age);
//     callback();
//   }, 3000);
// });

// hook.callAsync("shdulu", 30, (err) => {
//   console.log(err);
//   console.timeEnd("cost");
// });

console.time("cost");
hook.tapPromise("1", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(1, name, age);
      resolve();
    }, 1000);
  });
});

hook.tapPromise("2", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(2, name, age);
      resolve();
    }, 2000);
  });
});

hook.tapPromise("3", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(3, name, age);
      resolve();
    }, 3000);
  });
});

hook.promise("shdulu", 22).then((err) => {
  console.log(err);
  console.timeEnd("cost");
});
