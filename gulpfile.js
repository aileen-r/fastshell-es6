var gulp = require('gulp'),
  gutil = require('gulp-util'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  autoprefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  eslint = require('gulp-eslint'),
  header = require('gulp-header'),
  rename = require('gulp-rename'),
  cssnano = require('gulp-cssnano'),
  sourcemaps = require('gulp-sourcemaps'),
  babel = require('gulp-babel'),
  package = require('./package.json');

var banner = [
  '/*!\n' +
    ' * <%= package.name %>\n' +
    ' * <%= package.title %>\n' +
    ' * <%= package.url %>\n' +
    ' * @author <%= package.author %>\n' +
    ' * @version <%= package.version %>\n' +
    ' * Copyright ' +
    new Date().getFullYear() +
    '. <%= package.license %> licensed.\n' +
    ' */',
  '\n',
].join('');

gulp.task('css', function() {
  return gulp
    .src('src/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('app/assets/css'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(banner, { package: package }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/assets/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js', function() {
  return gulp
    .src('src/js/scripts.js')
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(header(banner, { package: package }))
    .pipe(gulp.dest('app/assets/js'))
    .pipe(uglify())
    .on('error', function(err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(header(banner, { package: package }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/assets/js'))
    .pipe(browserSync.reload({ stream: true, once: true }));
});

gulp.task('browser-sync', function() {
  browserSync.init(null, {
    server: {
      baseDir: 'app',
    },
  });
});
gulp.task('bs-reload', function() {
  browserSync.reload();
});

gulp.task(
  'default',
  gulp.parallel(['css', 'js', 'browser-sync'], function() {
    gulp.watch('src/scss/**/*.scss', gulp.series('css'));
    gulp.watch('src/js/*.js', gulp.series('js'));
    gulp.watch('app/*.html', gulp.series('bs-reload'));
  })
);
