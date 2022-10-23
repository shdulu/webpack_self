// babel按需加载原理
import "./style.css";
import './style.less'
import _ from "lodash";
console.log("lodash_", _);

document.getElementById("btn").addEventListener("click", () => {
  import(/* webpackPreload: true */ "./title").then((result) => {
    console.log(result.default);
  });
});
