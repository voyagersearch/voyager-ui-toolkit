/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are splitted in several files in the gulp directory
 *  because putting all here was really too long
 */

'use strict';

var gulp = require('gulp');
var wrench = require('wrench');
var path = require('path');
var conf = require('./gulp/conf');

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
wrench.readdirSyncRecursive('./gulp').filter(function (file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function (file) {
  require('./gulp/' + file);
});

gulp.task('watch', function () {
	gulp.watch([
		path.join(conf.paths.src, '/dist/**/*.ts')
	], ['dist']);
	gulp.watch([
		path.join(conf.paths.tmp, '/dist/**/*.js'),
		path.join(conf.paths.src, '/**/*.spec.js'),
		path.join(conf.paths.src, '/**/*.mock.js')
	], ['test']);
});

/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
