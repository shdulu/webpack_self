import { flatten, concat } from "lodash";

// babel-plugin-import 实现原理是把上面的引入方式变成下面的

// import flatten from "lodash/flatten";
// import concat from "lodash/concat";

console.log(flatten([1, [2, 3]]));
console.log(concat(["1", "2", "3"]));
