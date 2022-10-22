```js
// 生成hash
function createHash() {
  return require("crypto").createHash("md5");
}
let hash = createHash()
  .update(entry1Content)
  .update(entry2Content)
  .update(depMoudle1Content)
  .update(depMoudle2Content)
  .digest("hex");
```

```js
// 生成 chunkhash
function createHash() {
  return require("crypto").createHash("md5");
}
let entry1Chunkhash = createHash()
  .update(entry1Content)
  .update(depMoudle1Content)
  .digest("hex");

let entry2Chunkhash = createHash()
  .update(entry2Content)
  .update(depMoudle2Content)
  .digest("hex");
```
