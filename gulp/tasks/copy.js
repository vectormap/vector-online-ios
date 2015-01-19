var gulp = require('gulp');
var merge = require('merge-stream');

gulp.task('copy', function() {
	var html = gulp
    .src(['index.html'])
		.pipe(gulp.dest('build'));

  //var fonts = gulp
  //  .src('./libs/PixelAdmin-1.3.0/help/assets/fontawesome/**')
  //  .pipe(gulp.dest('build/fonts/font-awesome'));

  return merge(html /*, fonts*/);
});
