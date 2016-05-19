var gulp = require('gulp')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , rename = require('gulp-rename')
  , browserSync = require('browser-sync').create();

gulp.task('build', function () {
  gulp.src([
    'develop/src/echarts-ng.shim.js',
    'develop/src/echarts-ng.declare.js',
    'develop/src/echarts-ng-waterfall.service.js',
    'develop/src/echarts-ng-dimension.service.js',
    'develop/src/echarts-ng.service.js',
    'develop/src/echarts-ng.directive.js'
  ])
    .pipe(concat('echarts-ng.js'))
    .pipe(gulp.dest('dist/'))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('serve', function () {
  var baseServerOpts = {
    server: {
      baseDir: "develop/",
      index: "index.html"
    }
  };

  browserSync.init(baseServerOpts);
});