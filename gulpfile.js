var gulp = require('gulp')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , rename = require('gulp-rename')
  , browserSync = require('browser-sync').create();

gulp.task('build', function() {
  gulp.src(['src/echarts-ng.declare.js', 'src/echarts-ng.service.js', 'src/echarts-ng.directive.js'])
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