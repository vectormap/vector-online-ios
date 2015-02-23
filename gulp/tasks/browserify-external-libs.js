var browserify   = require('browserify');
var bundleLogger = require('../util/bundleLogger');
var gulp         = require('gulp');
var handleErrors = require('../util/handleErrors');
var source       = require('vinyl-source-stream');
var aliasify     = require('aliasify');

var externalLibs = require('../../package.json').externalLibs || [];

gulp.task('browserify-external-libs', function() {

  var bundler = browserify({
    cache: {}, packageCache: {}, fullPaths: true,
    debug: false
  });

  var bundle = function() {
    // Log when bundling starts
    bundleLogger.start();

    return bundler
      .require(externalLibs)
      .transform({global: true}, aliasify)
      .bundle()
      .on('error', handleErrors)
      .pipe(source('external-libs-bundle.js'))
      .pipe(gulp.dest('./build/online-app'))
      .on('end', bundleLogger.end);
  };

  return bundle();
});
