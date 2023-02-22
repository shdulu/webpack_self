const PLUGIN_NAME = "SkeletonPlugin";
const { resolve } = require("path");
const { readFileSync, writeFileSync } = require("fs");
const Server = require("./Server");
const Skeleton = require("./Skeleton");

const defaultOptions = {};
class SkeletonPlugin {
  constructor(options) {
    this.options = { ...defaultOptions, ...options };
  }
  apply(compiler) {
    // compiler webpack编译对象 上注册了很多钩子，可以通过tap监听钩子
    // 整个编译流程都完成了 dist目录下的文件都生成了触发 done 钩子函数
    compiler.hooks.done.tap(PLUGIN_NAME, async () => {
      console.log(PLUGIN_NAME, "done");
      // 启动一个http服务器
      await this.startServer();
      // 生成骨架屏的html 和css
      this.skeleton = new Skeleton(this.options);
      await this.skeleton.initialize();
      const skeletonHtml = await this.skeleton.genHtml(this.options.origin);
      console.log("skeletonHtml:", skeletonHtml);
      const originPath = resolve(this.options.staticDir, "index.html");
      const orgiginHtml = await readFileSync(originPath, "utf8");
      const finalHtml = orgiginHtml.replace("<!-- shell -->", skeletonHtml);
      await writeFileSync(originPath, finalHtml, "utf8");
      // 销毁 pub 服务
      await this.skeleton.destroy();
      await this.server.close();
      process.exit(0);
    });
  }
  async startServer() {
    this.server = new Server(this.options);
    await this.server.listen();
  }
}

module.exports = SkeletonPlugin;
