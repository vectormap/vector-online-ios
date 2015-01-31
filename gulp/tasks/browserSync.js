var browserSync         = require('browser-sync');
var gulp                = require('gulp');
var url = require('url');
var path = require('path');

gulp.task('browserSync', ['build'], function() {
	browserSync.init(['build/**/*.js', 'index.html'], {
		server: {
			baseDir: ['build'],
      routes: {
        // '/node_modules': '../node_modules'
      },
      middleware: function pushState(req, res, next) {
        var pathname = url.parse(req.url).pathname;
        var hasFileExtension = !!(path.extname(pathname));

        if (hasFileExtension) {
          next();
        } else {
          req.url = '/';
          next();
        }
      }
		},

    open: false
	});
});
