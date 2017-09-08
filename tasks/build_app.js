const bundle     = require('./bundle');
const jetpack    = require('fs-jetpack');
const gulp       = require('gulp');
const batch      = require('gulp-batch');
const gulpcopy   = require('gulp-copy');
const minifycss  = require('gulp-clean-css');
const minifyhtml = require('gulp-htmlmin');
const imagemin   = require('gulp-imagemin');
const jsonmin    = require('gulp-jsonmin');
const minify     = require('gulp-minify');
const plumber    = require('gulp-plumber');
const sass       = require('gulp-sass');
const watch      = require('gulp-watch');

const utils      = require('./utils');

const projectDir = jetpack;
const buildDir   = jetpack.cwd('./build');
const libsDir    = jetpack.cwd('./libs');
const srcDir     = jetpack.cwd('./src');
const resDir     = jetpack.cwd('./src/resources');
const destDir    = jetpack.cwd('./app');

gulp.task('bundle', () => {
	return Promise.all([
		bundle(srcDir.path('main.js'), destDir.path('main.js')),

		// Core Module
		// --
		bundle(srcDir.path('core/config.js'),              destDir.path('core/config.js')),
		bundle(srcDir.path('core/intercraft_launcher.js'), destDir.path('core/intercraft_launcher.js')),
		bundle(srcDir.path('core/event_manager.js'),       destDir.path('core/event_manager.js')),
		bundle(srcDir.path('core/task_manager.js'),        destDir.path('core/task_manager.js')),
		bundle(srcDir.path('core/window_manager.js'),      destDir.path('core/window_manager.js')),
		// -- Tasks
		bundle(srcDir.path('core/tasks/task.js'),                destDir.path('core/tasks/task.js')),
		bundle(srcDir.path('core/tasks/authentication_task.js'), destDir.path('core/tasks/authentication_task.js')),
		bundle(srcDir.path('core/tasks/initialize_task.js'),     destDir.path('core/tasks/initialize_task.js')),

		// Locale Module
		bundle(srcDir.path('locale/locale.js'), destDir.path('locale/locale.js')),

		// Gui Module
		// -- Windows
		bundle(srcDir.path('gui/windows/window.js'),        destDir.path('gui/windows/window.js')),
		bundle(srcDir.path('gui/windows/splash_window.js'), destDir.path('gui/windows/splash_window.js'))
	]);
});

gulp.task('libs', () => {
	return gulp.src(libsDir.path('./**/*'))
	           .pipe(gulp.dest(destDir.path()));
});

gulp.task('locale', () => {
	return gulp.src(resDir.path('locale/*'))
	           .pipe(jsonmin())
	           .pipe(gulp.dest(projectDir.path('locale')));
});

gulp.task('sass', () => {
	return gulp.src(resDir.path('stylesheets/app.scss'))
	           .pipe(sass())
	           .pipe(minifycss({debug: true}, function(details) {
		           console.log(details.name + ': ' + details.stats.originalSize);
		           console.log(details.name + ': ' + details.stats.minifiedSize);
	           }))
	           .pipe(gulp.dest(destDir.path('css')));
});

gulp.task('imagemin', () => {
	return gulp.src(resDir.path('images/*'))
	           .pipe(imagemin())
	           .pipe(gulp.dest(destDir.path('img')));
});

gulp.task('environment', () => {
	const configFile = `config/env_${utils.getEnvName()}.json`;
	projectDir.copy(configFile, destDir.path('env.json'), { overwrite: true });
});

gulp.task('javascript', () => {
	return gulp.src(resDir.path('javascript/*.js'))
	                      .pipe(gulp.dest(destDir.path('js')));
});

gulp.task('views', () => {
	return gulp.src(resDir.path('templates/*.htm'))
	           .pipe(minifyhtml({
	                     collapseWhitespace: true,
	                     minifyCSS: true,
	                     minifyJS: true,
	                     removeScriptTypeAttributes: true,
	                     removeStyleLinkTypeAttributes: true,
	                     removeComments: true
	             }))
	            .pipe(gulp.dest(destDir.path('views')));
});

gulp.task('package_json', () => {
	return gulp.src(buildDir.path('package.json'))
	           .pipe(gulp.dest(destDir.path()));
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

	watch('libs/**/*', batch((events, done) => {
		gulp.start('bundle', beepOnError(done));
	}));
	watch('src/**/*.js', batch((events, done) => {
		gulp.start('bundle', beepOnError(done));
	}));
	watch('src/resource/locale/*', batch((events, done) => {
		gulp.start('bundle', beepOnError(done));
	}));
	watch('src/resources/javascript/*.js', batch((events, done) => {
		gulp.start('javascript', beepOnError(done));
	}));
	watch('src/resources/stylesheets/*.scss', batch((events, done) => {
		gulp.start('sass', beepOnError(done));
	}));
	watch('src/resources/templates/*.htm', batch((events, done) => {
		gulp.start('views', beepOnError(done));
	}));
	watch('src/resources/images/*', batch((events, done) => {
		gulp.start('imagemin', beepOnError(done));
	}));
});

gulp.task('build', [
	'bundle',
	'libs',
	'locale',
	'sass',
	'javascript',
	'views',
	'imagemin',
	'environment',
	'package_json'
]);