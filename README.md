# postcss sprite 插件

## 简介

  ![image](https://github.com/cjg125/postcss-sprite/raw/master/sprite.gif)

## 环境准备
  > nodejs >= 7.0.0

## 安装
```bash
$ npm install postcss-sprite --save-dev
```

## 快速上手

  - ### 在gulp中使用
    ```bash
    npm install gulp-cli -g
    npm install gulp gulp-postcss postcss-sprite --save-dev
    ```

    ```js
    const gulp = require('gulp')
    const postcss = require('gulp-postcss')
    const sprite = require('postcss-sprite')
    gulp.task('css', () => {
      return gulp.src('*.css')
        .pipe(postcss([
          sprite({
            baseSize: 16,
            basePath: './src/img',
            cssImagePath:'../img',
            spriteName: 'sprite.png',
            spritePath: "./build/img",
            spritesmithOptions: {
              padding: 2
            },
            filter: function(url) {
              return !!~url.indexOf('/src/')
            },
          })
        ]))
        .pipe(gulp.dest('./build/css'))
    })
    ```
  - ### 结合 gulp-sass
    [examples](https://github.com/cjg125/postcss-sprite/blob/master/gulpfile.js)

  - ### 其他使用

    [postcss](https://github.com/postcss/postcss#usage)

## API

  - baseSize
    - 如果设置那么单位会用 rem

  - basePath
    - background-image 为绝对路径的时候
      - path.join
    - background-image 为相对地址的时候
      - path.resolve

  - spriteName
    - 生成精灵图的名称
    - 默认 "sprite.png"

  - spritePath
    - 生成精灵图的路径
    - 默认 "./"

  - cssImagePath
    - 如果声明会替换css文件里图片的路径部分，否则仅仅替换文件名
    - 默认 undefined

  - spritesmithOptions
    - [spritesmith](https://github.com/Ensighten/spritesmith#spritesheetprocessimagesimages-options)

  - filter
    - 返回值 true | false
    - 默认值 true
    - 如果返回 false 当前图片url 不进行sprite操作

## 更新记录
  - v1.4.0 (2017-05-25)
    - 支持移动端的 background-size 图片命名 xxx@2x.jpg xxx@3x.jps

    - 支持 rem 单位 设置 baseSize 参数

    - 默认添加宽高到生成的 css 里