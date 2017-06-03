const gulp = require('gulp');
const gulpcopy = require('gulp-copy');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const batch = require('gulp-batch');
const minifycss = require('gulp-clean-css');
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const jetpack = require('fs-jetpack');
const bundle = require('./bundle');
const utils = require('./utils');

const projectDir = jetpack;
const srcDir = jetpack.cwd('./src');
const destDir = jetpack.cwd('./app');

gulp.task('bundle', () => {
  return Promise.all([
    bundle(srcDir.path('main.js'), destDir.path('main.js')),
  ]);
});

gulp.task('sass', function() {
  return gulp.src(srcDir.path('stylesheets/app.scss'))
        .pipe(sass())
        .pipe(minifycss({debug: true}, function(details) {
          console.log(details.name + ': ' + details.stats.originalSize);
          console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest(destDir.path('css')));
});

gulp.task('imagemin', function() {
  return gulp.src(srcDir.path('images/*'))
        .pipe(imagemin())
        .pipe(gulp.dest(destDir.path('img')));
});

gulp.task('environment', () => {
  const configFile = `config/env_${utils.getEnvName()}.json`;
  projectDir.copy(configFile, destDir.path('env.json'), { overwrite: true });
});

gulp.task('javascript', () => {
  return gulp.src(srcDir.path('javascript/*.js'))
            .pipe(gulp.dest(destDir.path('js')));
});

gulp.task('watch', () => {
  const beepOnError = (done) => {
    return (err) => {
      if (err) {
        utils.beepSound();
      }
      done(err);
    };
  };

  watch('src/*.js', batch((events, done) => {
    gulp.start('bundle', beepOnError(done));
  }));
  watch('src/javascript/*.js', batch((events, done) => {
    gulp.start('javascript', beepOnError(done));
  }));
  watch('src/stylesheets/*.scss', batch((events, done) => {
    gulp.start('sass', beepOnError(done));
  }));
  watch('src/images/*', batch((events, done) => {
    gulp.start('imagemin', beepOnError(done));
  }));
});

gulp.task('build', ['bundle', 'sass', 'imagemin', 'environment']);