function loader(source) {
  console.log("inline1", source);
  return source + "//inline1";
}
loader.pitch = function(rem, pre, data) {
  data.id = 1
  console.log('inline1-pitch');
}
loader.raw = true
module.exports = loader;