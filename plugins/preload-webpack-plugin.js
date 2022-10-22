/**
 * 1. 查找当前产出的代码块里有哪些异步代码
 * 2. 针对每个异步代码块生成一个link标签
 * 3. 把生成的link标签插入到结果的HTML 文件中
 *
 * @class PreloadWebpackPlugin
 */
const HtmlWebpackPlugin = require("html-webpack-plugin");
class PreloadWebpackPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap("PreloadWebpackPlugin", (compilation) => {
      // 在准备生成资源标签之前执行
      console.log('PreloadWebpackPlugin11111111111111111')
      HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
        "PreloadWebpackPlugin",
        (htmlData, callback) => {
          this.generateLinks(compilation, htmlData, callback);
        }
      );
    });
    compiler.hooks.compilation.tap("PreloadWebpackPlugin", (compilation) => {
      // 在准备生成资源标签之前执行
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tap(
        "PreloadWebpackPlugin",
        (htmlData) => {
          const { resourceHints } = this;
          if (resourceHints) {
            htmlData.assetTags.styles = [
              ...resourceHints,
              ...htmlData.assetTags.styles,
            ];
          }
          return htmlData;
        }
      );
    });
  }
  generateLinks(compilation, htmlData, callback) {
    const { rel, include } = this.options;
    // 本次编译产出的代码块
    let chunks = [...compilation.chunks];
    if (include === undefined || include === "asyncChunks") {
      // 如果chunk.canBeInitial() 为true，说明这是一个入口模块
      // 只要异步代码块
      chunks = chunks.filter((chunk) => !chunk.canBeInitial());
    }
    let allFiles = chunks.reduce((accumulated, chunk) => {
      return accumulated.add(...chunk.files);
    }, new Set());
    const links = [];
    for (const file of allFiles.values()) {
      links.push({
        tagName: "link",
        attributes: {
          rel,
          href: file,
        },
      });
    }
    this.resourceHints = links;
    callback();
  }
}

module.exports = PreloadWebpackPlugin;
