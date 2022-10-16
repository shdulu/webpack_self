const { AsyncParallelBailHook } = require("tapable");
// 异步并行钩子 & 保险
const hook = new AsyncParallelBailHook(["name", "age"]);

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
      resolve('result2');
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
