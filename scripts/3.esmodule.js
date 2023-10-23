"use strict";
var __webpack_modules__ = {
    "./src/index.js": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      eval(
        '__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _title__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./title */ "./src/title.js");\n\nconsole.log(_title__WEBPACK_IMPORTED_MODULE_0__["default"]);\nconsole.log(_title__WEBPACK_IMPORTED_MODULE_0__.age);\n\n//# sourceURL=webpack://webpack_self/./src/index.js?'
      );
    },
    "./src/title.js": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      eval(
        '__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "age": () => (/* binding */ age),\n/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("title_name");\nvar age = "title_age";\n\n//# sourceURL=webpack://webpack_self/./src/title.js?'
      );
    },
  },
  __webpack_module_cache__ = {};
function __webpack_require__(_) {
  var e = __webpack_module_cache__[_];
  if (void 0 !== e) return e.exports;
  var r = (__webpack_module_cache__[_] = { exports: {} });
  return __webpack_modules__[_](r, r.exports, __webpack_require__), r.exports;
}
(__webpack_require__.d = (_, e) => {
  for (var r in e)
    __webpack_require__.o(e, r) &&
      !__webpack_require__.o(_, r) &&
      Object.defineProperty(_, r, { enumerable: !0, get: e[r] });
}),
  (__webpack_require__.o = (_, e) =>
    Object.prototype.hasOwnProperty.call(_, e)),
  (__webpack_require__.r = (_) => {
    "undefined" != typeof Symbol &&
      Symbol.toStringTag &&
      Object.defineProperty(_, Symbol.toStringTag, { value: "Module" }),
      Object.defineProperty(_, "__esModule", { value: !0 });
  });
var __webpack_exports__ = __webpack_require__("./src/index.js");
