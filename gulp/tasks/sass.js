var gulp         = require('gulp');
var sass         = require('gulp-ruby-sass');
var changed      = require('gulp-changed');
var handleErrors = require('../util/handleErrors');
var filter       = require('gulp-filter');
var browserSync  = require('browser-sync');
var prefix       = require('gulp-autoprefixer');
var concat       = require('gulp-concat');
var plumber      = require('gulp-plumber');

gulp.task('sass', function () {
  return gulp.src('./src/**/*.scss')
    .pipe(plumber())
    .pipe(changed('./build/scripts', {extension: '.scss'}))
    .pipe(sass({
      sourcemap: false,
      sourcemapPath: './build/',
      loadPath: [
        './node_modules/bootstrap-sass/assets/stylesheets/'
      ]
    }))
    .pipe(prefix())
    .pipe(filter('**/*.css'))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.reload({stream:true}))
    .on('error', handleErrors)
    ;
});
