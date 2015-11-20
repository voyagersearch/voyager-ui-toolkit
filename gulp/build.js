'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

//gulp.task('other', function () {
//  var fileFilter = $.filter(function (file) {
//    return file.stat.isFile();
//  });
//
//  return gulp.src([
//    path.join(conf.paths.src, '/**/*'),
//    path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss,ts}')
//  ])
//    .pipe(fileFilter)
//    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
//});

gulp.task('clean', ['tsd:purge'], function (done) {
  $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')], done);
});

gulp.task('build', ['dist']);
