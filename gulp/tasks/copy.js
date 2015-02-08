var gulp = require('gulp');
var merge = require('merge-stream');

gulp.task('copy', function() {
	var html = gulp
    .src('index.html')
		.pipe(gulp.dest('build'));

  var images = gulp
   .src('src/images/**/*')
   .pipe(gulp.dest('build/images'));

  var styles = gulp
   .src([/*'src/styles/ionic.css',*/ 'node_modules/leaflet/dist/leaflet.css'])
   .pipe(gulp.dest('build'));

  var fonts = gulp
   .src('src/styles/fonts/**/*')
   .pipe(gulp.dest('build/fonts'));

  return merge(html, styles, images, fonts);
});
