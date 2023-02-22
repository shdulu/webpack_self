const http = require("http");
const express = require("express");

class Server {
  constructor(options) {
    this.options = options;
  }
  listen() {
    const app = (this.app = express());
    // 使用一个静态文件中间件，让客户端可以访问staticDir里的文件
    app.use("/", express.static(this.options.staticDir));
    this.httpServer = http.createServer(app);
    return new Promise((resolve) => {
      this.httpServer.listen(this.options.port, () => {
        console.log(`server listen at port: ${this.options.origin}`);
        resolve();
      });
    });
  }
  async close() {
    return new Promise((resolve) => {
      this.httpServer.close(() => {
        console.log("server closed!");
        resolve();
      });
    });
  }
}
module.exports = Server;
