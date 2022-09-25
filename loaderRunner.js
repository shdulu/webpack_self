const { ifError } = require("assert");
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
    readResource,
  };
  const pitchingCallback = (err, result) => {
    finalCallback(err, {
      result,
      resourceBuffer: processOptions.resourceBuffer,
    });
  };
  // 开始迭代执行每个loader的pitch函数
  iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback);
}

/**
 * 迭代执行从左向右执行每一个loader的pitch函数
 *
 * @param {*} processOptions
 * @param {*} loaderContext
 * @param {*} pitchingCallback
 */
function iteratePitchingLoaders(
  processOptions,
  loaderContext,
  pitchingCallback
) {
  if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
    // 从左向右执行到最后一个，开始读文件
    return processResource(processOptions, loaderContext, pitchingCallback);
  }
  let currentLoader = loaderContext.loaders[loaderContext.loaderIndex];
  // iterate
  if (currentLoader.pitchExecuted) {
    loaderContext.loaderIndex++;
    return iteratePitchingLoaders(
      processOptions,
      loaderContext,
      pitchingCallback
    );
  }
  let pitchFn = currentLoader.pitch;
  currentLoader.pitchExecuted = true; // 表示这个loader的pitch已经执行过了
  if (!pitchFn) {
    return iteratePitchingLoaders(
      processOptions,
      loaderContext,
      pitchingCallback
    );
  }
  // 同步或者异步的方式执行fn - 数组传递给 fn的参数
  runSyncOrAsync(
    pitchFn,
    loaderContext,
    [
      loaderContext.remainingRequest,
      loaderContext.previousRequest,
      loaderContext.data,
    ],
    (err, ...args) => {
      if (err) return pitchingCallback(err);
      // 如果pitch的返回值不为空,则跳过后续loader和读文件操作，直接掉头执行前一个loader的normal
      if (args.length > 0 && args.some((item) => item)) {
        loaderContext.loaderIndex--;
        iterateNormalLoaders(
          processOptions,
          loaderContext,
          args,
          pitchingCallback
        );
      } else {
        return iteratePitchingLoaders(
          processOptions,
          loaderContext,
          pitchingCallback
        );
      }
    }
  );
}

/**
 *
 *
 * @param {*} processOptions
 * @param {*} loaderContext
 * @param {*} args
 * @param {*} pitchingCallback
 */
function iterateNormalLoaders(
  processOptions,
  loaderContext,
  args,
  pitchingCallback
) {
  if (loaderContext.loaderIndex < 0) {
    return pitchingCallback(null, ...args);
  }
  let currentLoader = loaderContext.loaders[loaderContext.loaderIndex];
  if (currentLoader.normalExecuted) {
    loaderContext.loaderIndex--;
    return iterateNormalLoaders(
      processOptions,
      loaderContext,
      args,
      pitchingCallback
    );
  }
  let normalFn = currentLoader.normal;
  currentLoader.normalExecuted = true;
  convertArgs(args, currentLoader.raw);
  runSyncOrAsync(normalFn, loaderContext, args, (err, ...returnArgs) => {
    return iterateNormalLoaders(
      processOptions,
      loaderContext,
      [returnArgs],
      pitchingCallback
    );
  });
}
function convertArgs(args, raw) {
  if (raw && Buffer.isBuffer(args[0])) {
    args[0] = Buffer.from(args[0]);
  } else if (!raw && Buffer.isBuffer[args[0]]) {
    args[0] = args[0].toString("utf8");
  }
}
function runSyncOrAsync(fn, loaderContext, args, runCallback) {
  // 标识fn同步执行还是异步执行
  let isSync = true;
  // 在loader的函数里执行callback，相当于执行下一个loader对应的函数
  loaderContext.callback = (...args) => {
    runCallback(...args);
  };
  loaderContext.async = function () {
    isSync = false;
    return loaderContext.callback;
  };
  let result = fn.apply(loaderContext, args);
  // 如果是同步执行loader中的函数
  if (isSync) {
    // 直接调用runCallback 向下执行，如果是异步此处不执行了任何代码，等待loader里调用callback
    runCallback(null, result);
  }
}

/**
 * 读取资源
 *
 * @param {*} processOptions
 * @param {*} loaderContext
 * @param {*} pitchingCallback
 */
function processResource(processOptions, loaderContext, pitchingCallback) {
  processOptions.readResource(loaderContext.resource, (err, resourceBuffer) => {
    processOptions.resourceBuffer = resourceBuffer;
    loaderContext.loaderIndex--;
    iterateNormalLoaders(
      processOptions,
      loaderContext,
      [resourceBuffer],
      pitchingCallback
    );
  });
}

exports.runLoaders = runLoaders;
