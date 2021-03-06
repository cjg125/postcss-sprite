# postcss sprite 插件

## 简介

![image](https://github.com/cjg125/postcss-sprite/raw/master/sprite.gif)

## 环境准备

> nodejs >= 8.0.0

## 安装

```bash
$ yarn add postcss-sprite -D
```

## 使用

- ### webpack
  [https://github.com/postcss/postcss#webpack](https://github.com/postcss/postcss#webpack)

## API

- baseSize

  - 图片如果以 (xxx@2x.jpg, xxx@3x.jpg, xxx@nx.xxx) 命名则 通过 baseSize 转换 为 rem 单位
  - 默认 16

- input

  - 以该值为相对目录查找图片合并
  - 默认 "./"

- output

  - 生成精灵图的路径
  - 默认 "./"

- filename

  - 生成精灵图的名称
  - 默认 "sprite.png"

- revision

  - 以 sprite 图片的 md5 生成版本号
  - 默认值 true

- spritesmithOptions

  - [spritesmith](https://github.com/Ensighten/spritesmith#spritesheetprocessimagesimages-options)

- filter

  - 默认值 (url) => true
  - 如果返回 false 当前图片 url 不进行 sprite 操作

- publicPath: string: '' function
  - string 设置图片前缀
  - funciton
    ```js
    publicPath = opts => {
      let { dirname, filename } = opts;
      return join(dirname, filename);
    };
    ```

## 更新记录

- v3.0.0 (2019-08-28)

  - 删除 replaceUrl 添加 publicPath
  - source 改成 input

- v2.2.1 (2017-06-22)

  - 添加正确的 package.json engines 选项

- v2.2.0 (2017-06-20)

  - 参数 file -> filename
  - 修复没有图片合并时会生成一个空图片

- v2.1.0 (2017-06-19)

  - 添加 revision 选项,默认支持以 sprite 图片的 md5 值做版本号

- v2.0.0 (2017-06-19)

  - 完美支持开发环境与发布环境的 rem 支持
  - 需要 nodejs>=8.0.0 (用到了 promisify)
  - 不兼容 1.x.x 版本
  - 需要 background-image 来声明 不支持 background 简写

- v1.5.0 (2017-06-15)

  - 自动删除开发环境设置的 width height background-size

- v1.4.0 (2017-05-25)

  - 支持移动端的 background-size 图片命名 xxx@2x.jpg xxx@3x.jpg

  - 支持 rem 单位 设置 baseSize 参数

  - 默认添加宽高到生成的 css 里
