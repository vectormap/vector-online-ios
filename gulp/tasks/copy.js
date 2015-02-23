var gulp = require('gulp');
var merge = require('merge-stream');

gulp.task('copy', function() {
	var html = gulp
    .src('index.html')
		.pipe(gulp.dest('build/online-app'));

  var images = gulp
   .src('src/images/**/*')
   .pipe(gulp.dest('build/online-app/images'));

  var styles = gulp
   .src([/*'src/styles/ionic.css',*/ 'node_modules/leaflet/dist/leaflet.css'])
   .pipe(gulp.dest('build/online-app'));

  var fonts = gulp
   .src('src/styles/fonts/**/*')
   .pipe(gulp.dest('build/online-app/fonts'));

  var appLoader = gulp
   .src('src/scripts/app-loader.js')
   .pipe(gulp.dest('build/online-app'));

  return merge(html, styles, images, fonts, appLoader);
});
