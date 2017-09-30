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

		// Activities Module
		bundle(srcDir.path('activities/activity.js'),                destDir.path('activities/activity.js')),
		bundle(srcDir.path('activities/authentication_activity.js'), destDir.path('activities/authentication_activity.js')),
		bundle(srcDir.path('activities/initialize_activity.js'),     destDir.path('activities/initialize_activity.js')),
		bundle(srcDir.path('activities/launcher_activity.js'),       destDir.path('activities/launcher_activity.js')),

		// Core Module
		// --
		bundle(srcDir.path('core/activity_manager.js'),    destDir.path('core/activity_manager.js')),
		bundle(srcDir.path('core/config.js'),              destDir.path('core/config.js')),
		bundle(srcDir.path('core/intercraft_launcher.js'), destDir.path('core/intercraft_launcher.js')),
		bundle(srcDir.path('core/event_manager.js'),       destDir.path('core/event_manager.js')),
		bundle(srcDir.path('core/locale.js'),              destDir.path('core/locale.js')),
		bundle(srcDir.path('core/network_manager.js'),     destDir.path('core/network_manager.js')),
		bundle(srcDir.path('core/window_manager.js'),      destDir.path('core/window_manager.js')),

		// Gui Module
		// -- Windows
		bundle(srcDir.path('gui/windows/launcher_window.js'), destDir.path('gui/windows/launcher_window.js')),
		bundle(srcDir.path('gui/windows/login_window.js'),    destDir.path('gui/windows/login_window.js')),
		bundle(srcDir.path('gui/windows/splash_window.js'),   destDir.path('gui/windows/splash_window.js')),
		bundle(srcDir.path('gui/windows/window.js'),          destDir.path('gui/windows/window.js')),

		// InterCraft Module
		bundle(srcDir.path('intercraft/intercraft.js'), destDir.path('intercraft/intercraft.js')),
		bundle(srcDir.path('intercraft/account.js'),    destDir.path('intercraft/account.js')),
		
		// Minecraft Module
		bundle(srcDir.path('minecraft/launcher_profile.js'),          destDir.path('minecraft/launcher_profile.js')),
		bundle(srcDir.path('minecraft/launcher_profile_manager.js'),  destDir.path('minecraft/launcher_profile_manager.js')),
		bundle(srcDir.path('minecraft/launcher_settings.js'),         destDir.path('minecraft/launcher_settings.js')),
		bundle(srcDir.path('minecraft/minecraft_account.js'),         destDir.path('minecraft/minecraft_account.js')),
		bundle(srcDir.path('minecraft/minecraft_asset.js'),           destDir.path('minecraft/minecraft_asset.js')),
		bundle(srcDir.path('minecraft/minecraft_asset_manager.js'),   destDir.path('minecraft/minecraft_asset_manager.js')),
		bundle(srcDir.path('minecraft/minecraft_instance.js'),        destDir.path('minecraft/minecraft_instance.js')),
		bundle(srcDir.path('minecraft/minecraft_library.js'),         destDir.path('minecraft/minecraft_library.js')),
		bundle(srcDir.path('minecraft/minecraft_version.js'),         destDir.path('minecraft/minecraft_version.js')),
		bundle(srcDir.path('minecraft/minecraft_version_manager.js'), destDir.path('minecraft/minecraft_version_manager.js')),

		// Tasks Module
		bundle(srcDir.path('tasks/minecraft_launch_task.js'), destDir.path('tasks/minecraft_launch_task.js')),

		// Utils Module
		bundle(srcDir.path('utils/find_java.js'), destDir.path('utils/find_java.js')),
		bundle(srcDir.path('utils/utils.js'),     destDir.path('utils/utils.js'))
	]);
});

gulp.task('libs', () => {
	return gulp.src(libsDir.path('./**/*'))
	           .pipe(gulp.dest(destDir.path("resources")));
});

gulp.task('locale', () => {
	return gulp.src(srcDir.path('resources/locales/*'))
	           .pipe(jsonmin())
	           .pipe(gulp.dest(projectDir.path('data/locales')));
});

gulp.task('sass', () => {
	return gulp.src(resDir.path('sass/app.scss'))
	           .pipe(sass())
	           .pipe(minifycss({debug: true}, function(details) {
		           console.log(details.name + ': ' + details.stats.originalSize);
		           console.log(details.name + ': ' + details.stats.minifiedSize);
	           }))
	           .pipe(gulp.dest(destDir.path('resources/css')));
});

gulp.task('imagemin', () => {
	return gulp.src(resDir.path('images/*'))
	           .pipe(imagemin())
	           .pipe(gulp.dest(destDir.path('resources/img')));
});

gulp.task('environment', () => {
	const configFile = `config/env_${utils.getEnvName()}.json`;
	projectDir.copy(configFile, destDir.path('env.json'), { overwrite: true });
});

gulp.task('javascript', () => {
	return gulp.src(resDir.path('javascript/*.js'))
	                      .pipe(gulp.dest(destDir.path('resources/js')));
});

gulp.task('views', () => {
	return gulp.src(resDir.path('views/**/*.ejs'))
	           .pipe(minifyhtml({
	                     collapseWhitespace: true,
	                     minifyCSS: true,
	                     minifyJS: true,
	                     removeScriptTypeAttributes: true,
	                     removeStyleLinkTypeAttributes: true,
	                     removeComments: true
	             }))
	            .pipe(gulp.dest(destDir.path('resources/views')));
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
	watch('src/locale/locales/*', batch((events, done) => {
		gulp.start('bundle', beepOnError(done));
	}));
	watch('src/resources/javascript/*.js', batch((events, done) => {
		gulp.start('javascript', beepOnError(done));
	}));
	watch('src/resources/sass/*.scss', batch((events, done) => {
		gulp.start('sass', beepOnError(done));
	}));
	watch('src/resources/views/*.htm', batch((events, done) => {
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