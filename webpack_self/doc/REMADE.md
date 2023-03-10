### webpack 编译流程

1. 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数
2. 开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 `run` 方法开始执行编译;
   确定入口：根据配置中的 entry 找出所有的入口文件
3. 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行编译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
4. 完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
5. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
6. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

> 以上过程中， `webpack` 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 `webpack` 提供的 API 改变 `webpack`的运行结果。loader 执行在特定的时间点执行编译

![图片alt](图片地址 ''webpack 构建流程'')

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

- 在 Webpack 的回调函数中会得到 stats 对象
- 这个对象实际来自于 `Compilation.getStats()`，返回的是主要含有 `modules`、`chunks`和`assets`三个属性值的对象。
- Stats 对象本质上来自于 `lib/Stats.js` 的类实例

| 字段 | 含义 |
| ---- | :--: |
modules | 记录了所有解析后的模块
chunks | 记录了所有 chunk
assets | 记录了所有要生成的文件
