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

    ```js
    const gulp = require('gulp')
    const sprite = require('postcss-sprite')
    gulp.task('sass', () => {
      return gulp.src('*.css')
        .pipe(postcss([
          sprite({
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
    - 如果返回false 当前图片url 进行sprite超过