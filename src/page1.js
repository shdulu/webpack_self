import module1 from "./module/module1";
import module2 from "./module/module2";

let $ = require("jquery");

console.log(module1, module2, $);

import("./module/asyncModule1").then((asyncModule1) => {
  console.log(asyncModule1);
});
