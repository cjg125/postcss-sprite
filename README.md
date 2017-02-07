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
            imagePath: './src/img',
            spriteName: 'sprite.png',
            spritePath: "./build/img",
            spritesmithOptions: {
              padding: 2
            }
          })
        ]))
        .pipe(gulp.dest('./examples/build/css'))
    })
    ```
  - ### 结合 gulp-sass
    [examples](https://github.com/cjg125/postcss-sprite/blob/master/gulpfile.js)

  - ### 其他使用

    [postcss](https://github.com/postcss/postcss#usage)

## API

  - imagePath
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

  - spritesmithOptions
    - [spritesmith](https://github.com/Ensighten/spritesmith#spritesheetprocessimagesimages-options)