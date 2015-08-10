var gulp = require('gulp');
var gp = require('gulp-load-plugins')();
var fs = require('fs');

var wrapper = fs.readFileSync('./src/wrapper.js', 'utf-8');

gulp.task('buildDevLib', function () {
  return gulp.src('src/deser.js')
  .pipe(gp.plumber())
  .pipe(gp.sourcemaps.init())
  .pipe(gp.babel())
  .pipe(gp.wrapJs(wrapper, {
    indent: {
      style: '  ',
    },
  }))
  .pipe(gp.sourcemaps.write('./'))
  .pipe(gulp.dest('dist'));
});

gulp.task('buildProdLib', function () {
  return gulp.src('src/deser.js')
  .pipe(gp.plumber())
  .pipe(gp.sourcemaps.init())
  .pipe(gp.babel())
  .pipe(gp.wrapJs(wrapper, {
    indent: {
      style: '  ',
    },
  }))
  .pipe(gp.uglify())
  .pipe(gp.rename({
     extname: '.min.js',
   }))
  .pipe(gp.sourcemaps.write('./'))
  .pipe(gulp.dest('dist'));
});

gulp.task('buildTest', function () {
  return gulp.src('src/test/**/*.js')
  .pipe(gp.plumber())
  .pipe(gp.babel())
  .pipe(gulp.dest('dist/test'));
});

gulp.task('build', ['buildDevLib', 'buildProdLib', 'buildTest']);

gulp.task('watch', function() {
  gulp.watch([
    'src/deser.js',
    'src/wrapper.js',
  ], [
    'buildDevLib',
    'buildProdLib',
  ]);
  gulp.watch('src/test/**/*.js', ['buildTest']);
});

gulp.task('serve', ['build', 'watch']);
gulp.task('default', ['serve']);