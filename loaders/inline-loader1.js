function loader(source) {
  console.log("inline1", this.data.id);
  return source + "//inline1";
}
loader.pitch = function(rem, pre, data) {
  data.id = 1
  console.log('inline1-pitch');
}
module.exports = loader;