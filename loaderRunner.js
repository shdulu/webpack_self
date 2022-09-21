const fs = require("fs");

function createLoaderObject(loader) {
  // 获取loader的normal函数
  let normal = require(loader);
  // 获取loader的pitch函数
  let pitch = normal.pitch;
  // 如果true 传递给loader的源内容是一个Buffer，否则是一个字符串
  let raw = normal.raw;
  return {
    path: loader,
    normal,
    pitch,
    raw,
    data: {}, // 每个loader可以携带一个自定义的数据对象
    pitchExecuted: false, // pitch 函数是否执行
    normalExecuted: false, // normal 函数是否执行
  };
}
/**
 * @param {*} options 选项
 * @param {*} finalCallback 最终回调
 *
 */
function runLoaders(options, finalCallback) {
  const {
    resource, // 读取的文件
    loaders = [], // 对此文件生效和翻译的loader
    context = {}, // 上下文对象
    readResource = fs.readFile, // 读取文件的方法
  } = options;
  const loaderObjects = loaders.map(createLoaderObject);
  const loaderContext = context; //  loader 或pitch 函数执行的时候的this对象
  loaderContext.resource = resource;
  loaderContext.loaders = loaderObjects;
  loaderContext.readResource = readResource;
  loaderContext.loaderIndex = 0; // 表示当前正在执行的loader的索引
  // 这是一个回调函数，作用是调用它就会执行下一步 TODO
  loaderContext.callback = null;
  // 默认loader的执行是同步的，执行完loader代码后会默认执行下一步，如果调用了async会把同步变成异步
  loaderContext.async = null;
  Object.defineProperty(loaderContext, "request", {
    enumerable: true,
    get() {
      // loader1!loader2!loader3!index.js
      return loaderContext.loaders
        .map((loader) => loader.path)
        .concat(loaderContext.resource)
        .join("!");
    },
  });
  Object.defineProperty(loaderContext, "remainRequest", {
    enumerable: true,
    get() {
      // loader3!index.js
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex + 1)
        .map((loader) => loader.path)
        .concat(loaderContext.resource)
        .join("!");
    },
  });
  Object.defineProperty(loaderContext, "currentRequest", {
    enumerable: true,
    get() {
      // loader2!loader3!index.js
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex)
        .map((loader) => loader.path)
        .concat(loaderContext.resource)
        .join("!");
    },
  });
  Object.defineProperty(loaderContext, "previousRequest", {
    enumerable: true,
    get() {
      // loader1
      return loaderContext.loaders
        .slice(0, loaderContext.loaderIndex)
        .map((loader) => loader.path)
        .concat(loaderContext.resource)
        .join("!");
    },
  });
  Object.defineProperty(loaderContext, "data", {
    enumerable: true,
    get: function () {
      return loaderContext.loaders[loaderContext.loaderIndex].data;
    },
  });
  let processOptions = {
    resourceBuffer: null, // 本次要读取的资源文件的Buffer index.js 对用的buffer
    readResource
  };
}

exports.runLoaders = runLoaders;
