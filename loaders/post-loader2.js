function loader(source) {
  console.log("post2");
  // 如果让loader变成异步: 调用this.async 方法可以把 loader的执行从同步变成异步
  let callback = this.async();
  setTimeout(() => {
    callback(null, source + "//post2");
  }, 3000);
}
loader.pitch = function () {
  console.log("post2-pitch");
};
module.exports = loader;
