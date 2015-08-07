var gulp = require('gulp');
var gp = require('gulp-load-plugins')();

gulp.task('buildJs', function () {
  return gulp.src('src/**/*.js')
  .pipe(gp.plumber())
  // .pipe(gp.sourcemaps.init())
  // @todo gulp-wrap doesn't work with sourcemaps
  // .pipe(gp.wrap("require('source-map-support').install();<%= contents %>"))
  .pipe(gp.babel({
    // optional: ['es7.decorators'],
  }))
  // .pipe(gp.sourcemaps.write('./'))
  .pipe(gulp.dest('dist'));
});

gulp.task('build', ['buildJs']);

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['buildJs']);
});

gulp.task('serve', ['build', 'watch']);
gulp.task('default', ['serve']);