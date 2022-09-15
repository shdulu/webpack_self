const path = require("path");
function loader(cssContent) {
  //   let script = `
  //     let style = document.createElement('style');
  //     style.innerHTML = ${JSON.stringify(cssContent)};
  //     document.head.appendChild(style);`;
  //   return script;
}

// remainingRequest 剩下的
loader.pitch = function (remainingRequest) {
  console.log("style-loader:remainingRequest", remainingRequest);
  // 我们的请求格式 style-loader!less-loader!style.less
  let script = `
    let style = document.createElement('style');
    style.innerHTML = require(${stringifyRequest(
      this,
      "!!" + remainingRequest
    )});
    document.head.appendChild(style);`;
  console.log("style-loader:return", script);
  return script;
};

function stringifyRequest(loaderContext, request) {
  let prefixRep = /^-?!+/;
  let prefixResult = request.match(prefixRep);
  let prefix = prefixResult ? prefixResult[0] : "";
  const splitted = request.replace(prefixRep, "").split("!");
  const { context } = loaderContext;
  return JSON.stringify(
    prefix +
      splitted
        .map((part) => {
          part = path.relative(context, part);
          if (part[0] !== ".") part = "./" + part;
          return part.replace(/\\/g, "/");
        })
        .join("!")
  );
}
module.exports = loader;
