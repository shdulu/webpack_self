## webpack 编译流程

webpack 的运行流程是一个串行的流程，从启动到结束会依次执行以下流程:

1. 初始化参数: 从配置文件和 Shell 语句中读取与合并参数，得出最终的参数;
2. 开始编译: 用上一步得到的参数初始化 Compiler 对象，挂载所有配置的插件，执行对象的 `run` 方法开始执行编译。确定入口: 根据配置中的 entry 找出所有的入口文件
3. 编译模块: 从入口文件出发，调用所有配置的 Loader 对模块进行编译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理;
4. 完成模块编译: 在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系;
5. 输出资源: 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
6. 输出完成: 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

> 以上过程中， `webpack` 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 `webpack` 提供的 API 改变 `webpack`的运行结果。loader 执行在特定的时间点执行编译

![webpackSource](../images/webpackcode.jpg)   

### 调试 webpack

- 打开工程目录，点击调试按钮，再点击小齿轮的配置按钮系统就会生成 launch.json 配置文件
- 修改好了以后直接点击 F5 就可以启动调试
  .vscode\launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "debug webpack",
      "cwd": "${workspaceFolder}",
      "program": "${workspaceFolder}/node_modules/webpack-cli/bin/cli.js"
    }
  ]
}
```

### Stats 对象

[Stats 对象](超链接地址 "https://www.webpackjs.com/api/stats/")

使用 webpack 编译源码时，可以生成一个包含模块统计信息的 JSON 文件。这些统计信息可以用来分析应用中的依赖关系图，从而优化 webpack 的编译速度。该文件通常由以下 CLI 命令生成：
`npx webpack --profile --json=compilation-stats.json`

`--json=compilation-stats.json` 标志告诉 webpack 生成一个包含依赖关系图和其他各种构建信息的 `compilation-stats.json` 文件。通常情况下，`--profile` 标志也会被添加，这样的话每个 module objects 都会增加一个 profile 部分，它包含了特定模块的统计信息。

```js
const compiler = webpack(options);
compiler.run((err, stats) => {
  console.log(err);
  console.log(
    stats.toJson({
      entries: true, // 所有入口对象
      chunks: true, // 所有的chunk代码块
      modules: true, // 所有模块
      assets: true, // 本次编译产出的资源 也就是 bundle 文件
    })
  );
});
```

- 在 Webpack 的回调函数中会得到 stats 对象
- 这个对象实际来自于 `Compilation.getStats()`，返回的是主要含有 `modules`、`chunks`和`assets`三个属性值的对象。
- Stats 对象本质上来自于 `lib/Stats.js` 的类实例

| 字段        |                                         含义                                          |
| ----------- | :-----------------------------------------------------------------------------------: |
| modules     | 记录了所有解析后的所有模块，每个模块包含一个 reasons 列表描述了与他相关的模块依赖关系 |
| chunks      |                               代表一组名为 chunk 的模块                               |
| assets      |       编译过程中生成的 output 文件,一个或者多个 chunk 打包生成一个 assets 文件        |
| entrypoints |                                  包含所有的入口信息                                   |
