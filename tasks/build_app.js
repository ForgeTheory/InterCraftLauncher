const gulp = require('gulp');
const gulpcopy = require('gulp-copy');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const batch = require('gulp-batch');
const minifycss = require('gulp-clean-css');
const minifyhtml = require('gulp-htmlmin')
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const jetpack = require('fs-jetpack');
const bundle = require('./bundle');
const utils = require('./utils');

const projectDir = jetpack;
const srcDir = jetpack.cwd('./src');
const resDir = jetpack.cwd('./src/resources');
const destDir = jetpack.cwd('./app');

gulp.task('bundle', () => {
	return Promise.all([
		bundle(srcDir.path('config.js'), destDir.path('config.js')),
		bundle(srcDir.path('intercraft.js'), destDir.path('intercraft.js')),
		bundle(srcDir.path('intercraft_auth.js'), destDir.path('intercraft_auth.js')),
		bundle(srcDir.path('main.js'), destDir.path('main.js')),
		bundle(srcDir.path('minecraft.js'), destDir.path('minecraft.js')),
		bundle(srcDir.path('mojang.js'), destDir.path('mojang.js')),
		bundle(srcDir.path('utils.js'), destDir.path('utils.js')),
		bundle(srcDir.path('view_loader.js'), destDir.path('view_loader.js')),
		bundle(srcDir.path('window_manager.js'), destDir.path('window_manager.js')),

		bundle(srcDir.path('launcher/account.js'), destDir.path('launcher/account.js')),
		bundle(srcDir.path('launcher/launcher.js'), destDir.path('launcher/launcher.js')),
		bundle(srcDir.path('launcher/minecraft_instance.js'), destDir.path('launcher/minecraft_instance.js')),
		bundle(srcDir.path('launcher/minecraft_instance_manager.js'), destDir.path('launcher/minecraft_instance_manager.js')),
		bundle(srcDir.path('launcher/profile.js'), destDir.path('launcher/profile.js')),
		bundle(srcDir.path('launcher/profile_manager.js'), destDir.path('launcher/profile_manager.js')),
		bundle(srcDir.path('launcher/version.js'), destDir.path('launcher/version.js')),
		bundle(srcDir.path('launcher/version_manager.js'), destDir.path('launcher/version_manager.js'))
	]);
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
	watch('src/launcher/*.js', batch((events, done) => {
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
	'sass',
	'javascript',
	'views',
	'imagemin',
	'environment'
]);