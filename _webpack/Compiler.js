const { SyncHook } = require("tapable");
const Compilation = require("./Compilation");

class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(), // 编译开始的时候触发
      done: new SyncHook(), // 编译结束的时候触发
    };
  }
  // 4. 执行`Compiler`对象的`run`方法开始执行编译
  run() {
    // 在编译前触发run钩子执行 表示开始启动编译
    this.hooks.run.call();
    // 编译完成后的回调
    const onCompiled = () => {
      // 当编译成功后会触发done这个钩子执行
      this.hooks.done.call();
    };
    // 开始编译，编译成功之后调用onCompiled
    this.compiler(onCompiled);
  }
  compiler(callback) {
    // webpack 虽然只有一个Compiler,但是每次编译都会产出一个新的Compilation
    const compilation = new Compilation();
    // 执行compilation的build方法进行编译，编译成功后执行回调
    compilation.buildDependencies(callback);
  }
}

module.exports = Compiler;
