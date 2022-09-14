function loader(source) {
  console.log("inline2");
  return source + "//inline2";
}
loader.pitch = function() {
  console.log('inline2-pitch');
  // pitch 有返回值的话 会跳国后面的loader执行，执行前一个loader的normal函数
  // return 'inline2-result'
}
module.exports = loader;