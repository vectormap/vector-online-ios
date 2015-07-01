var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var merge = require('merge-stream');

var distPath = 'build/online-app/mobile-vmp-online-dist';

gulp.task('dist', function () {
  var minify = gulp.src('build/online-app/index.html')
    .pipe(usemin({
      outputRelativePath: '/',
      css: [minifyCss({keepSpecialComments: 0, advanced: false}), 'concat', rev()],
      html: [minifyHtml({empty: true})],
      js: [uglify(), rev()]
    }))
    .pipe(gulp.dest(distPath));

    var copyImages = gulp
       .src('build/online-app/images/**/*')
       .pipe(gulp.dest(distPath + '/images'));

    var copyFonts = gulp
       .src('build/online-app/fonts/**/*')
       .pipe(gulp.dest(distPath + '/fonts'));

    return merge(minify, copyImages, copyFonts);
});

