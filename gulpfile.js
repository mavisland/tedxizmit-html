'use strict';

/**
 * Load Plugins.
 *
 * Load gulp plugins and passing them semantic names.
 */
var gulp = require('gulp');

// CSS related plugins.
var autoPrefixer = require('gulp-autoprefixer');
var cleanCSS     = require('gulp-clean-css');
var cssComb      = require('gulp-csscomb');
var less         = require('gulp-less');

// JS related plugins.
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// Image related plugins.
var imageMin = require('gulp-imagemin');

// Template related plugins.
var data     = require('gulp-data');
var nunjucks = require('gulp-nunjucks-render');

// Utility related plugins.
var pkg         = require('./package.json');
var filesys     = require('fs');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;
var archiver    = require('gulp-archiver');
var cache       = require('gulp-cache');
var del         = require('del');
var header      = require('gulp-header');
var gutil       = require('gulp-util');
var notify      = require('gulp-notify');
var plumber     = require('gulp-plumber');
var rename      = require('gulp-rename');

//if node version is lower than v.0.1.2
require('es6-promise').polyfill();

// Set the banner content
var banner = [
  '/*!\n' +
  ' * <%= pkg.description %>\n' +
  ' *\n' +
  ' * <%= pkg.name %>\n' +
  ' * <%= pkg.homepage %>\n' +
  ' *\n' +
  ' * @author <%= pkg.author.name %> <<%= pkg.author.email %>> \n' +
  ' * @version <%= pkg.version %>\n' +
  ' * Copyright (c) ' + new Date().getFullYear() + '. <%= pkg.license %> licensed.\n' +
  ' */',
  '\n'
].join('');

// Get Timestamp
var getTimestamp = function() {
  var date       = new Date();

  var dateYear   = date.getFullYear().toString();
  var dateMonth  = ('0' + (date.getMonth() + 1)).slice(-2);
  var dateDay    = ('0' + date.getDate()).slice(-2);
  var timeHour   = date.getHours().toString();
  var timeMinute = date.getMinutes().toString();
  var timeSecond = date.getSeconds().toString();

  return dateYear + dateMonth + dateDay + '-' + timeHour + timeMinute + timeSecond;
};

/**
 * Task: 'archive'.
 *
 * Archive generated files.
 */
gulp.task('archive', function () {
  return gulp.src('public/**')
    .pipe(archiver(pkg.name + '_build_' + getTimestamp() + '.zip'))
    .pipe(gulp.dest('./build'))
    .pipe(notify({
      message: 'TASK: "archive" Completed! 💯',
      onLast: true
    }));
});

/**
 * Task: 'clean'.
 *
 * Delete all generated files.
 */
gulp.task("clean", function () {
  return del(['public']);
});

/**
 * Task: 'copy'.
 */
gulp.task('copy', [
  'copy:images',
  'copy:fonts',
  'copy:modernizr',
  'copy:scripts'
]);

/**
 * Task: 'copy:fonts'.
 */
gulp.task('copy:fonts', function(){
  return gulp.src([
    'src/components/font-awesome/fonts/*.{eot,svg,ttf,woff,woff2}'
  ])
    .pipe(gulp.dest("./public/assets/fonts"))
    .pipe(reload({stream: true}))
    .pipe(notify({
      message: 'TASK: "copy:fonts" Completed! 💯',
      onLast: true
    }));
});

/**
 * Task: 'copy:images'.
 *
 * Minifies PNG, JPEG, GIF and SVG images.
 *
 * This task will run only once, if you want to run it
 * again, do it with the command 'gulp images'.
 */
gulp.task('copy:images', function(){
  gulp.src([
    'src/components/owl-carousel/images/*.{png,jpg,gif}'
  ])
    .pipe(cache(imageMin({
      progressive: true,
      optimizationLevel: 7, // 0-7 low-high
      interlaced: true,
      svgoPlugins: [{removeViewBox: false}]
    })))
    .pipe(gulp.dest('./public/assets/images'))
    .pipe(reload({stream: true}))
    .pipe(notify({
      message: 'TASK: "copy:images" Completed! 💯',
      onLast: true
    }));
});

/**
 * Task: 'copy:modernizr'.
 */
gulp.task('copy:modernizr', function(){
  return gulp.src('src/components/modernizr/modernizr.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./public/assets/js'))
    .pipe(reload({stream: true}))
    .pipe(notify({
      message: 'TASK: "copy:modernizr" Completed! 💯',
      onLast: true
    }));
});

/**
 * Task: 'copy:scripts'.
 */
gulp.task('copy:scripts', function(){
  // Vendor Javascript files
  return gulp.src([
    'src/scripts/vendor/jquery.min.js',
    'src/scripts/vendor/html5-respond.min.js'
  ])
    .pipe(gulp.dest('./public/assets/js'))
    .pipe(reload({stream: true}))
    .pipe(notify({
      message: 'TASK: "copy:scripts" Completed! 💯',
      onLast: true
    }));
});

/**
 * Task: 'images'.
 *
 * Minifies PNG, JPEG, GIF and SVG images.
 *
 * This task will run only once, if you want to run it
 * again, do it with the command 'gulp images'.
 */
gulp.task('images', function(){
  return gulp.src(['src/images/**/*'])
    .pipe(plumber(function(error) {
      // Output an error message
      gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
      // emit the end event, to properly end the task
      this.emit('end');
    }))
    .pipe(cache(imageMin({
      progressive: true,
      optimizationLevel: 7, // 0-7 low-high
      interlaced: true,
      svgoPlugins: [{removeViewBox: false}]
    })))
    .pipe(gulp.dest('./public/assets/images'))
    .pipe(reload({stream: true}))
    .pipe(notify({
      message: 'TASK: "images" Completed! 💯',
      onLast: true
    }));
});

/**
 * Task: 'scripts'.
 *
 * Concatenate and uglify vendor JS scripts.
 */
gulp.task('scripts', function(){
  gulp.src([
    'src/components/bootstrap/js/transition.js',
    'src/components/bootstrap/js/alert.js',
    'src/components/bootstrap/js/button.js',
    'src/components/bootstrap/js/carousel.js',
    'src/components/bootstrap/js/collapse.js',
    'src/components/bootstrap/js/dropdown.js',
    'src/components/bootstrap/js/modal.js',
    'src/components/bootstrap/js/tooltip.js',
    'src/components/bootstrap/js/popover.js',
    'src/components/bootstrap/js/scrollspy.js',
    'src/components/bootstrap/js/tab.js',
    'src/components/bootstrap/js/affix.js',
    'src/components/magnific-popup/js/jquery.magnific-popup.js',
    'src/components/owl-carousel/js/owl.carousel.js',
    'src/scripts/main.js'
  ])
    .pipe(plumber(function(error) {
      // Output an error message
      gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
      // emit the end event, to properly end the task
      this.emit('end');
    }))
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('./public/assets/js'))
    .pipe(rename({suffix: '.min'}))
    // Minify JS
    .pipe(uglify())
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('./public/assets/js'))
    .pipe(reload({stream: true}))
    .pipe(notify({
      message: 'TASK: "scripts" Completed! 💯',
      onLast: true
    }));
});

/**
 * Task: 'styles'.
 *
 * Compiles Less, Autoprefixes it and Minifies CSS.
 */
gulp.task('styles', function(){
  return gulp.src(['src/styles/style.less'])
    .pipe(plumber(function(error) {
      // Output an error message
      gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
      // emit the end event, to properly end the task
      this.emit('end');
    }))
    .pipe(less({
      // Specify search paths for @import directives
      paths: ["."]
    }))
    .pipe(autoPrefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(cssComb())
    .pipe(gulp.dest('./public/assets/css'))
    .pipe(rename({suffix: '.min'}))
    // Minify compiled CSS
    .pipe(cleanCSS({
      compatibility: 'ie8',
      level: {
        1: {
          specialComments: 0
        }
      }
    }))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('./public/assets/css'))
    .pipe(reload({stream: true}))
    .pipe(notify({
      message: 'TASK: "styles" Completed! 💯',
      onLast: true
    }));
});

/**
 * Task: 'styles'.
 *
 * Compiles Nunjuck templates to HTML.
 */
gulp.task('templates', function(){
  return gulp.src('src/templates/*.njk')
    .pipe(plumber(function(error) {
      // Output an error message
      gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
      // emit the end event, to properly end the task
      this.emit('end');
    }))
    // Adding data to Nunjucks
    .pipe(data(function() {
      return JSON.parse(filesys.readFileSync('./src/data/site.json'));
    }))
    // Renders template with nunjucks
    .pipe(nunjucks({
      path: ['src/templates']
    })).on('error', gutil.log)
    // output files in public folder
    .pipe(gulp.dest('./public'))
    .pipe(reload({stream: true}))
    .pipe(notify({
      message: 'TASK: "templates" Completed! 💯',
      onLast: true
    }));
});

/**
 * Watch Tasks.
 *
 * Watches for file changes and runs specific tasks.
 */
gulp.task('default', ['copy', 'images', 'styles', 'scripts', 'templates'], function(){
  browserSync.init({
    server: './public'
  });

  // Images
  gulp.watch([
    'src/components/**/*.{png,jpg,gif,svg}',
    'src/images/**/*.{png,jpg,gif,svg}'
  ], ['imagemin']);

  // Styles
  gulp.watch([
    'src/components/**/*.less',
    'src/fonts/**/*.less',
    'src/styles/**/*.less'
  ], ['styles']);

  // Scripts
  gulp.watch([
    'src/components/**/*.js',
    'src/scripts/**/*.js'
  ], ['scripts']);

  // Templates
  gulp.watch([
    'src/data/*.json',
    'src/templates/**/*.njk'
  ], ['templates']);
});
