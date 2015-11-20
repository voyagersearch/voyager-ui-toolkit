'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

  var tsProject = $.typescript.createProject({
    target: 'es5',
    sortOutput: true
  });

  gulp.task('dist', ['scripts'], function () {

    return gulp.src(path.join(conf.paths.tmp, '/dist/**/*.js'))
      .pipe($.sourcemaps.init())
      .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
      .pipe($.sourcemaps.write('maps'))
      .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
      .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
  });

  gulp.task('scripts', ['tsd:install'], function () {
  return gulp.src(path.join(conf.paths.src, '/**/*.ts'))
    .pipe($.sourcemaps.init())
    .pipe($.tslint())
    .pipe($.tslint.report('prose', { emitError: false }))
    .pipe($.typescript(tsProject)).on('error', conf.errorHandler('TypeScript'))
    .pipe($.concat('vs.toolkit.min.js'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/dist')))
    .pipe($.size())
});
