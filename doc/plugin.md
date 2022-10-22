自动使用外链插件

1. html 中引入 CDN 脚本
2. 配置 webpack，把这个模块设置为外链

自动配置外链

1. 自动向 index.html 里插入 CDN 脚本
2. 改造 webpack 生成模块的流程，如果发现是外链模块，则要选择不打包，而是变成从全局变量引入


### @vue/preload-webpack-plugin