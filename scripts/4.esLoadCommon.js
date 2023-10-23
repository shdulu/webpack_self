var __webpack_modules__ = {
  "./src/index.js": (
    __unused_webpack_module,
    __webpack_exports__,
    __webpack_require__
  ) => {
    "use strict";
    eval(
      '__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _title__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./title */ "./src/title.js");\n/* harmony import */ var _title__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_title__WEBPACK_IMPORTED_MODULE_0__);\n\nconsole.log((_title__WEBPACK_IMPORTED_MODULE_0___default()));\nconsole.log(_title__WEBPACK_IMPORTED_MODULE_0__.age);\n\n//# sourceURL=webpack://webpack_self/./src/index.js?'
    );
  },

  "./src/title.js": (module) => {
    eval(
      'module.exports = {\n  name: "title_name",\n  age: "title_age"\n};\n\n//# sourceURL=webpack://webpack_self/./src/title.js?'
    );
  },
};

var __webpack_module_cache__ = {};

function __webpack_require__(moduleId) {
  var cachedModule = __webpack_module_cache__[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = (__webpack_module_cache__[moduleId] = {
    exports: {},
  });

  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

  return module.exports;
}

__webpack_require__.n = (module) => {
  var getter =
    module && module.__esModule ? () => module["default"] : () => module;
  __webpack_require__.d(getter, { a: getter });
  return getter;
};

// define getter functions for harmony exports
__webpack_require__.d = (exports, definition) => {
  for (var key in definition) {
    if (
      __webpack_require__.o(definition, key) &&
      !__webpack_require__.o(exports, key)
    ) {
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key],
      });
    }
  }
};

__webpack_require__.o = (obj, prop) =>
  Object.prototype.hasOwnProperty.call(obj, prop);

// define __esModule on exports
__webpack_require__.r = (exports) => {
  if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
  }
  Object.defineProperty(exports, "__esModule", { value: true });
};

// startup
var __webpack_exports__ = __webpack_require__("./src/index.js");
