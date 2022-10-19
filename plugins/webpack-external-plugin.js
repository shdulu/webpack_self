/**
 * 1. 收集项目中的依赖模块， 取和插件配置文件中的交集
 * 2. 修改外联模块的生产过程，把他么变成一个外部模块
 * 3. 修改产出的html文件，往html里插入CDN脚本的url地址
 * @class WebpackExternalPlugin
 */
const { ExternalModule } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

class WebpackExternalPlugin {
  constructor(options) {
    this.options = options;
    this.externalModules = Object.keys(this.options); // 进行自动外键的模块 [jquery, lodash]
    this.importedModules = new Set(); // 存放着所有的实际真正使用到的外部依赖模块
  }
  apply(compiler) {
    // https://webpack.docschina.org/api/normalmodulefactory-hooks/
    compiler.hooks.normalModuleFactory.tap(
      "WebpackExternalPlugin",
      (normalModuleFactory) => {
        normalModuleFactory.hooks.parser
          .for("javascript/auto") //普通 的JS文件对应的钩子就是'javascript/auto'
          .tap("WebpackExternalPlugin", (parser) => {
            //在parser遍历语法的过程中，如果遍历到了import节点
            parser.hooks.import.tap(
              "WebpackExternalPlugin",
              (statement, source) => {
                if (this.externalModules.includes(source)) {
                  this.importedModules.add(source);
                }
              }
            );
            parser.hooks.call
              .for("require")
              .tap("WebpackExternalPlugin", (expression) => {
                let source = expression.arguments[0].value;
                if (this.externalModules.includes(source)) {
                  this.importedModules.add(source);
                }
              });
          });

        //2.改造模块的生产过程，如果是外链模块，就直接生产一个外链模块返回
        // 在初始化解析之前调用。它应该返回 undefined 以继续
        normalModuleFactory.hooks.factorize.tapAsync(
          "WebpackExternalPlugin",
          (resolveData, callback) => {
            let { request } = resolveData; // 要生产的模块
            if (this.externalModules.includes(request)) {
              let { variable } = this.options[request];
              //request=jquery window.jQuery
              callback(null, new ExternalModule(variable, "window", request));
            } else {
              callback(null); //如果是正常模块，直接向后执行。走正常的打包模块的流程
            }
          }
        );
      }
    );
    compiler.hooks.compilation.tap("WebpackExternalPlugin", (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
        "WebpackExternalPlugin",
        (htmlData, callback) => {
          Reflect.ownKeys(this.options)
            .filter((key) => this.importedModules.has(key))
            .forEach((key) => {
              //jquery
              htmlData.assetTags.scripts.unshift({
                tagName: "script",
                voidTag: false,
                attributes: {
                  defer: false,
                  src: this.options[key].url,
                },
              });
            });
          callback(null, htmlData);
        }
      );
    });
  }
}
module.exports = WebpackExternalPlugin;
