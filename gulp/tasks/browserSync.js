var browserSync = require('browser-sync');
var gulp        = require('gulp');

gulp.task('browserSync', ['build'], function() {
	browserSync.init(['build/**/*.js', 'index.html'], {
		server: {
			baseDir: ['./'],
      routes: {
        // '/node_modules': '../node_modules'
      }
		},

    open: false
	});
});
