const puppeteer = require("puppeteer");
const { KnownDevices } = require("puppeteer");
const iPhone = KnownDevices["iPhone 6"];

let { readFileSync } = require("fs");
let { resolve } = require("path");
let { sleep } = require("./utils");

class Skeleton {
  constructor(options = {}) {
    this.options = options;
  }
  async initialize() {
    // 开发一个无头浏览器
    this.browser = await puppeteer.launch({ headless: false });
  }
  // 打开新的页签
  async newPage() {
    const page = await this.browser.newPage();
    await page.emulate(iPhone);
    return page;
  }
  async makeSkeleton(page) {
    const { defer = 10000 } = this.options;
    // 读取脚本内容
    const scriptContent = await readFileSync(
      resolve(__dirname, "skeletonScript.js"),
      "utf8"
    );
    // 向页面注入脚本
    await page.addScriptTag({ content: scriptContent });
    await sleep(defer);
    // 脚本执行完成后，创建骨架屏dom结构
    await page.evaluate((options) => {
      Skeleton.genSkeleton(options);
    }, this.options);
  }
  // 生成 骨架屏的dom字符串
  async genHtml(url) {
    const page = await this.newPage();
    // 打开url地址，直到 network 停止下载
    const response = await page.goto(url, { waitUntil: "networkidle2" });
    if (response && !response.ok()) {
      // 访问失败
      throw new Error(`${response.status} on ${url}`);
    }
    // 创建骨架屏
    await this.makeSkeleton(page);
    const { styles, html } = await page.evaluate(() =>
      Skeleton.getHtmlAndStyle()
    );
    let result = `
            <style>${styles.join("\n")}</style>
            ${html}
        `;
    return Promise.resolve(result);
  }
  // 销毁方法
  async destroy() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
module.exports = Skeleton;
