var browserify   = require('browserify');
var watchify     = require('watchify');
var bundleLogger = require('../util/bundleLogger');
var gulp         = require('gulp');
var handleErrors = require('../util/handleErrors');
var source       = require('vinyl-source-stream');
var _6to5        = require('6to5ify');
var aliasify     = require('aliasify');
var externalLibs = require('../external-libs');
var cssify       = require('cssify');
var reactify     = require('reactify');

gulp.task('browserify', function() {

	var bundler = browserify({
    cache: {}, packageCache: {}, fullPaths: true,
		// Specify the entry point of your app
		entries: ['./src/scripts/app.jsx'],
		// Add file extentions to make optional in your requires
		extensions: ['.js', '.jsx', /*'.css', '.scss'*/],
		debug: !gulp.env.production, // enable source maps
    //global: true, // global transforms
    paths: ['./src/scripts'],
    fast: true,
    detectGlobals: false
	});


  var bundle = function() {
    // Log when bundling starts
    bundleLogger.start();

    return bundler
      .external(externalLibs)
      // .transform({global: true}, aliasify)
      // .transform(reactify)
      // .transform(cssify)
      .transform(_6to5.configure({
        sourceMap: 'inline'
      }))
			.bundle()
      // Report compile errors
      .on('error', handleErrors)
      // Use vinyl-source-stream to make the
      // stream gulp compatible. Specifiy the
      // desired output filename here.
      .pipe(source('app.js'))
      // .pipe(changed('./build/', {extension: '.js'}))
      // .pipe(debug({verbose: true}))
      // .pipe(transform(function () { return exorcist('./build/app.js.map'); }))
      // Specify the output destination
      .pipe(gulp.dest('./build/'))
			// Log when bundling completes!
			.on('end', bundleLogger.end);
	};

	if(global.isWatching) {
    bundler = watchify(bundler);
		// Rebundle with watchify on changes.
		bundler.on('update', bundle);
	}

	return bundle();
});
