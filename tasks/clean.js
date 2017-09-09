const gulp = require('gulp');
const clean = require('gulp-clean');
const jetpack = require('fs-jetpack');

var rootDir = jetpack;

gulp.task('clean', () => {
	gulp.src(rootDir.path('app'))
	    .pipe(clean());

	gulp.src(rootDir.path('data'))
		.pipe(clean());
});
