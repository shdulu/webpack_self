var modules = {
  "./src/title.js": (module, exports, require) => {
    require.r(exports);
  },
};
var cache = {};
function require(moduleId) {
  var cachedModule = cache[moduleId];
  if (cachedModule) {
    return cachedModule.exports;
  }
  var module = (cache[moduleId] = { exports: {} });
  modules[moduleId](module, module.exports, require);
  return module.exports;
}

require.r = (exports) => {
  Object.defineProperty(exports, Symbol.toStringTag, {
    value: "Module",
  });
  Object.defineProperty(exports, "__esModule", { value: true });
};

let title = require("./title");