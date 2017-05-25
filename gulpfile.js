const gulp = require('gulp')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const sprite = require('./lib')
const del = require('del')

gulp.task('clean', () => {
  return del(['./examples/build'])
})
gulp.task('img', ['clean'], () => {
  return gulp.src([
      './examples/src/img/*.*',
      './examples/src/img/*/*',
      '!./examples/src/img/src/*'
    ])
    .pipe(gulp.dest('./examples/build/img'))
})

gulp.task('sass', ['clean'], () => {
  return gulp.src('./examples/src/sass/*.scss')
    .pipe(sass({
      // outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(postcss([
      sprite({
        baseSize: 16, // rem
        basePath: './examples/src/img',
        cssImagePath: '../img',
        spriteName: 'sprite.png',
        spritePath: "./examples/build/img",
        filter: function (url) {
          return !!~url.indexOf('/src/')
        },
        spritesmithOptions: {
          padding: 2
        }
      })
    ]))
    .pipe(gulp.dest('./examples/build/css'))
})

gulp.task('default', ['img', 'sass'])