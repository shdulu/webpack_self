/**
 *
 *
 * @class EntryOptionPlugin
 */
class EntryOptionPlugin {
  apply(compiler) {
    compiler.hooks.entryOption.tap("EntryOptionPlugin", (context, entry) => {
      EntryOptionPlugin.applyEntryOption(compiler, context, entry);
      return true;
    });
  }
  /**
   *
   * @static
   * @param {Compiler} compiler
   * @param {string} context
   * @param {Entry} entry
   * @memberof EntryOptionPlugin
   * @returns {void}
   */
  static applyEntryOption(compiler, context, entry) {
    if (typeof entry === "function") {
      const DynamicEntryPlugin = require("./DynamicEntryPlugin");
      new DynamicEntryPlugin(context, entry).apply(compiler);
    } else {
      const EntryPlugin = require("./EntryPlugin");
      for (const name of Object.keys(entry)) {
        const desc = entry[name];
        const options = EntryOptionPlugin.entryDescriptionToOptions(
          compiler,
          name,
          desc  
        );
        for (const entry of desc.import) {
            new EntryPlugin(context, entry, options).apply(compiler)
        }
      }
    }
  }
  /**
   * Entry 描述符(descriptor) 其实并不知道这些描述符用来干啥
   *
   * @static
   * @param {*} compiler
   * @param {*} name
   * @param {*} desc
   * @return {*} 
   * @memberof EntryOptionPlugin
   */
  static entryDescriptionToOptions(compiler, name, desc) {
    const options = {
      name,
      filename: desc.filename,
      runtime: desc.runtime,
      layer: desc.layer,
      dependOn: desc.dependOn,
      baseUri: desc.baseUri,
      publicPath: desc.publicPath,
      chunkLoading: desc.chunkLoading,
      asyncChunks: desc.asyncChunks,
      wasmLoading: desc.wasmLoading,
      library: desc.library,
    };
    return options
  }
}

module.exports = EntryOptionPlugin;
