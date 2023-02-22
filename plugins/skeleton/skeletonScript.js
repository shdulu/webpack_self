// 增加一个全局变量 
window.Skeleton = (function () {
  console.log('window.Skeleton.......')
  // w 1px h1px 透明gif图
  const SMALLEST_BASE64 =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  const CLASS_NAME_PREFEX = "sk-";
  const $$ = document.querySelectorAll.bind(document);
  const REMOVE_TAGS = ["title", "meta", "style", "script"];
  const styleCache = new Map();
  const setAttributes = (ele, attrs) => {
    Object.keys(attrs).forEach((k) => ele.setAttribute(k, attrs[k]));
  };
  const addStyle = (selector, rule) => {
    // 避免类名重复
    if (!styleCache.has(selector)) {
      styleCache.set(selector, rule);
    }
  };
  // img 元素处理
  function imgHandler(ele, options = {}) {
    const { width, height } = ele.getBoundingClientRect();
    const attrs = {
      width,
      height,
      src: SMALLEST_BASE64,
    };
    setAttributes(ele, attrs);
    const className = CLASS_NAME_PREFEX + "image";
    const rule = `{ background: ${options.color} !important;}`;
    addStyle(`.${className}`, rule);
    ele.classList.add(className);
  }
  // button 元素处理 -改变button元素样式
  function buttonHandler(ele, options = {}) {
    const classname = CLASS_NAME_PREFEX + "button";
    const rule = `{
            color: ${options.color} !important;
            background: ${options.color} !important;
            border: none !important;
            box-shadow: none !important;
          }`;
    addStyle(`.${classname}`, rule);
    ele.classList.add(classname);
  }
  // 转换原始元素的为骨架屏元素
  function genSkeleton(options = {}) {
    // 遍历整个dom元素树，获取生一个节点或者元素，根据元素类型进行依次转换
    const rootElement = document.documentElement;
    (function traverse(options) {
      let { button, image } = options;
      const buttons = []; // 放置所有的btn
      const imgs = []; // 放置所有的图
      (function preTraverse(ele) {
        if (ele.children && ele.children.length > 0) {
          // 先遍历儿子，
          Array.from(ele.children).forEach((child) => preTraverse(child));
        }
        if (ele.tagName === "BUTTON") {
          return buttons.push(ele);
        }
        if (ele.tagName === "IMG") {
          return imgs.push(ele);
        }
      })(rootElement);
      // 循环处理btn、img
      buttons.forEach((e) => buttonHandler(e, button));
      imgs.forEach((e) => imgHandler(e, image));
    })(options);
    let rules = "";
    for (const [selector, rule] of styleCache) {
      rules += `${selector} ${rule}\n`;
    }
    const styleEle = document.createElement("style");
    styleEle.innerHTML = rules;
    document.head.appendChild(styleEle);
  }
  function getHtmlAndStyle() {
    const styles = Array.from($$("style")).map(
      (style) => style.innerHTML || style.innerText
    );
    Array.from($$(REMOVE_TAGS.join(","))).forEach((ele) =>
      ele.parentNode.removeChild(ele)
    );
    const html = document.body.innerHTML;
    return { html, styles };
  }
  return { genSkeleton, getHtmlAndStyle };
})();
