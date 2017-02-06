const gulp = require('gulp')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const sprite = require('./lib')


gulp.task('sass', () => {
  return gulp.src('./examples/src/sass/*.scss')
    .pipe(sass({
      // outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(postcss([
      sprite({
        imagePath: './examples/src/img',
        spritePath: "./examples/build/img" // sprite 图片输出路径
      })
    ]))
    .pipe(gulp.dest('./examples/build/css'))
})

