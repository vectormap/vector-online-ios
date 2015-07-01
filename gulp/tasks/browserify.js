var browserify   = require('browserify');
var watchify     = require('watchify');
var bundleLogger = require('../util/bundleLogger');
var gulp         = require('gulp');
var handleErrors = require('../util/handleErrors');
var source       = require('vinyl-source-stream');
var babelify     = require('babelify');
var externalLibs = require('../../package.json').externalLibs || [];
var collapse     = require('bundle-collapser/plugin');

gulp.task('browserify', function() {

	var bundler = browserify({
    cache: {}, packageCache: {}, fullPaths: true,
		entries: ['./src/scripts/app.jsx'],
		extensions: ['.js', '.jsx' /*'.css', '.scss'*/],
		debug: false, //!gulp.env.production, // enable source maps
    //global: true, // global transforms
    paths: ['./src/scripts'],
    fast: true,
    detectGlobals: false,
    fullPaths: false
	});

  bundler.transform(babelify.configure({
    ignore: 'node_modules',
    sourceMap: false
  }));

  var bundle = function() {
    // Log when bundling starts
    bundleLogger.start();

    return bundler
      .external(externalLibs)
      .require('./src/scripts/app.jsx', { expose: 'online-app'})
      .plugin(collapse)
      .bundle()
      .on('error', handleErrors)
      .pipe(source('mobile-online-app.js'))
      .pipe(gulp.dest('./build/online-app'))
			.on('end', bundleLogger.end);
	};

	if(global.isWatching) {
    bundler = watchify(bundler);
		// Rebundle with watchify on changes.
		bundler.on('update', bundle);
	}

	return bundle();
});
