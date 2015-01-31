var gulp         = require('gulp');
// var sass         = require('gulp-ruby-sass');
var sass         = require('gulp-sass');
var changed      = require('gulp-changed');
var handleErrors = require('../util/handleErrors');
var filter       = require('gulp-filter');
var browserSync  = require('browser-sync');
var prefix       = require('gulp-autoprefixer');
var concat       = require('gulp-concat');
var plumber      = require('gulp-plumber');

gulp.task('sass', function () {
  return gulp.src('./src/styles/**/*.scss')
    .pipe(plumber())
    // .pipe(changed('./build/scripts', {extension: '.scss'}))
    .pipe(sass({
      errLogToConsole: true,

      // sass.renderSync will be called, instead of sass.render.
      // This should help when memory and/or cpu usage is getting very high when rendering many and/or big files.
      // sync: true
    }))
    .pipe(prefix())
    // .pipe(filter('**/*.css'))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.reload({stream:true}))
    .on('error', handleErrors)
    ;
});
