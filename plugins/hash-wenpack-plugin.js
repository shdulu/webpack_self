class WebpackHashPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap("WebpackHashPlugin", (compilation) => {
      compilation.hooks.afterHash.tap("WebpackHashPlugin", () => {
        console.log("hash", compilation.hash);
        compilation.hash = "newHash";
        for (const chunk of compilation.chunks) {
          console.log("chunkhash", chunk.hash);
          chunk.renderedHash = "newChunkHash";
          chunk.contentHash = {
            'javascript': 'newContentHash',
            'css/mini-extract': 'newCssContentHash'
          }
        }
      });
    });
  }
}

module.exports = WebpackHashPlugin;
