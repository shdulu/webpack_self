(() => {
  var __webpack_modules__ = {
    "./src/index.js": (
      __unused_webpack_module,
      __unused_webpack_exports,
      __webpack_require__
    ) => {
      eval(
        'var title = __webpack_require__(/*! ./title */ "./src/title.js");\nconsole.log(title);\n\n//# sourceURL=webpack://webpack_self/./src/index.js?'
      );
    },

    "./src/title.js": (module) => {
      eval(
        'module.exports = "title";\n\n//# sourceURL=webpack://webpack_self/./src/title.js?'
      );
    },
  };

  var cache = {};
  function __webpack_require__(moduleId) {
    var cachedModule = cache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    // Create a new module (and put it into the cache)
    var module = (cache[moduleId] = {
      exports: {},
    });

    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

    return module.exports;
  }

  // startup
  // Load entry module and return exports
  // This entry module can't be inlined because the eval devtool is used.
  var __webpack_exports__ = __webpack_require__("./src/index.js");
})();
