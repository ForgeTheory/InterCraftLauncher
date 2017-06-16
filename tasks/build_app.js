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
const destDir = jetpack.cwd('./app');

gulp.task('bundle', () => {
	return Promise.all([
		bundle(srcDir.path('config.js'), destDir.path('config.js')),
		bundle(srcDir.path('http_request.js'), destDir.path('http_request.js')),
		bundle(srcDir.path('intercraft.js'), destDir.path('intercraft.js')),
		bundle(srcDir.path('intercraft_auth.js'), destDir.path('intercraft_auth.js')),
		bundle(srcDir.path('main.js'), destDir.path('main.js')),
		bundle(srcDir.path('minecraft.js'), destDir.path('minecraft.js')),
		bundle(srcDir.path('minecraft_launcher.js'), destDir.path('minecraft_launcher.js')),
		bundle(srcDir.path('mojang.js'), destDir.path('mojang.js')),
		bundle(srcDir.path('view_loader.js'), destDir.path('view_loader.js')),
		bundle(srcDir.path('window_manager.js'), destDir.path('window_manager.js'))
	]);
});

// gulp.task('bundle', () => {
//	 return gulp.src(srcDir.path('*.js'))
//				 .pipe(gulp.dest('./app'));
// });

gulp.task('sass', () => {
	return gulp.src(srcDir.path('stylesheets/app.scss'))
	           .pipe(sass())
	           .pipe(minifycss({debug: true}, function(details) {
		           console.log(details.name + ': ' + details.stats.originalSize);
		           console.log(details.name + ': ' + details.stats.minifiedSize);
	           }))
	           .pipe(gulp.dest(destDir.path('css')));
});

gulp.task('imagemin', () => {
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

gulp.task('views', () => {
	return gulp.src(srcDir.path('templates/*.htm'))
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
	watch('src/javascript/*.js', batch((events, done) => {
		gulp.start('javascript', beepOnError(done));
	}));
	watch('src/stylesheets/*.scss', batch((events, done) => {
		gulp.start('sass', beepOnError(done));
	}));
	watch('src/templates/*.htm', batch((events, done) => {
		gulp.start('views', beepOnError(done));
	}));
	watch('src/images/*', batch((events, done) => {
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