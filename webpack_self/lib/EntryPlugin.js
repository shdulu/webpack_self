class EntryPlugin {
  constructor(context, entry, options) {
    this.context = context;
    this.entry = entry;
    this.options = options || "";
  }
  apply(compiler) {
    compiler.hooks.compilation.tap(
      "EntryPlugin",
      (compilation, { normalModuleFactory }) => {}
    );
    const { entry, options, context } = this;
    const dep = EntryPlugin.createDependency(entry, options)

    compiler.hooks.make.tapAsync("EntryPlugin", (compilation, callback) => {
      console.log('make 触发')
      compilation.addEntry(context, dep, options, (err) => {
        callback(err);
      });
    });
  }

  static createDependency() {
    return {}
  }
}

module.exports = EntryPlugin;
