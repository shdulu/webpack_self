// webpackBootstrap
var __modules__ = {
  "./src/index.js": (
    __unused_webpack_module,
    __unused_webpack_exports,
    __require__
  ) => {
    eval(
      'var title = __require__(/*! ./title */ "./src/title.js");\nconsole.log(title["default"]);\nconsole.log(title.age);\n\n//# sourceURL=webpack://webpack_self/./src/index.js?'
    );
  },

  "./src/title.js": (
    __unused_webpack_module,
    __webpack_exports__,
    __require__
  ) => {
    "use strict";
    eval(
      '__require__.r(__webpack_exports__);\n/* harmony export */ __require__.d(__webpack_exports__, {\n/* harmony export */   "age": () => (/* binding */ age),\n/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("title_name");\nvar age = "title_age";\n\n//# sourceURL=webpack://webpack_self/./src/title.js?'
    );
  },
};

var cache = {};
function __require__(moduleId) {
  var cachedModule = cache[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = (cache[moduleId] = {
    exports: {},
  });

  __modules__[moduleId](module, module.exports, __require__);
  return module.exports;
}

__require__.d = (exports, definition) => {
  for (var key in definition) {
    // definition 上有，exports上没有的挂在exports对象上
    if (__require__.o(definition, key) && !__require__.o(exports, key)) {
      // 在exports对象上挂导出的属性，在取值的时候执行 get.
      // 通过getter挂在属性因为 esmodule 导出的是引用可以实时访问
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key],
      });
    }
  }
};

// 判断对象上是否有某属性
__require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

__require__.r = (exports) => {
  if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
    // 添加自定义模块类型 Module
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
  }
  // 给exports对象上添加 __esModule 标识
  Object.defineProperty(exports, "__esModule", { value: true });
};
var __webpack_exports__ = __require__("./src/title.js");
console.log(__webpack_exports__.default);

/**
 * commonjs 导出的是值
 * esModule 导出的是引用
 *
 * */

function require_d() {
  let age = 100;
  let obj = {};
  Object.defineProperty(obj, "age", { get: () => age });
  let obj1 = { age: age };
  console.log(obj.age, obj1.age);
  age = 200;
  console.log(obj.age, obj1.age);
}

require_d();
