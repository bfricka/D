var gulp = require('gulp');
var mocha = require('gulp-mocha');
var traceur = require('gulp-traceur');

gulp.task('traceur', function () {
  return gulp
    .src('src/**/*.js')
    .pipe(traceur({ sourceMaps: false }))
    .pipe(gulp.dest('dist'));
});

gulp.task('mocha', ['traceur'], function() {
  return gulp
    .src('test/**/*.spec.js', { read: false })
    .pipe(mocha());
});

gulp.task('watch', function () {
  gulp.watch(['src/**/*.js', 'test/**/*.spec.js'], ['mocha']);
});

gulp.task('default', ['traceur']);
