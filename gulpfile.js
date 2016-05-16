var gulp = require('gulp')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , rename = require('gulp-rename')
  , browserSync = require('browser-sync').create();

gulp.task('build', function () {
  gulp.src([
    'example/src/echarts-ng.shim.js',
    'example/src/echarts-ng.declare.js',
    'example/src/echarts-ng-waterfall.service.js',
    'example/src/echarts-ng-dimension.service.js',
    'example/src/echarts-ng.service.js',
    'example/src/echarts-ng.directive.js'
  ])
    .pipe(gulp.dest('src/'))
    .pipe(concat('echarts-ng.js'))
    .pipe(gulp.dest('dist/'))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('serve', function () {
  var baseServerOpts = {
    server: {
      baseDir: "example/",
      index: "index.html"
    }
  };

  browserSync.init(baseServerOpts);
});