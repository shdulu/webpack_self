const { SyncHook } = require("tapable");

class _SyncHook {
  constructor(args) {
    this.args = args;
    this.argsLength = args ? args.length : 0;
    this.taps = [];
  }
  tap(name, fn) {
    this.taps.push({ name, fn });
  }
  call() {
    let args = Array.prototype.slice.call(arguments, 0, this.argsLength);
    this.taps.forEach((tap) => tap.fn(...args));
  }
}

const syncHook = new _SyncHook(["name"]);

syncHook.tap("监听器名称1", (name) => {
  console.log("监听器名称1", name);
});
syncHook.tap("监听器名称2", (name) => {
  console.log("监听器名称2", name);
});

syncHook.tap("监听器名称3", (name) => {
  console.log("监听器名称3", name);
});

syncHook.call("hello tapable");

// class SomePlugin {
//   apply() {
//     this.compiler.hooks.tap("SomePlugin", (tt) => {
//       console.log("SomePlugin", tt);
//     });
//   }
// }
// new SomePlugin().apply();
