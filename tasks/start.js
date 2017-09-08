const childProcess = require('child_process');
const electron = require('electron');
const gulp = require('gulp');

gulp.task('debug', ['build'], () => {
  childProcess.spawn(electron, ['--debug=5858', '.'], { stdio: 'inherit' })
  .on('close', () => {
    // User closed the app. Kill the host process.
    process.exit();
  });
});

gulp.task('debug-brk', ['build'], () => {
  childProcess.spawn(electron, ['--debug-brk=5858', '.'], { stdio: 'inherit' })
  .on('close', () => {
    // User closed the app. Kill the host process.
    process.exit();
  });
});

gulp.task('start', ['build'], () => {
  childProcess.spawn(electron, ['.'], { stdio: 'inherit' })
  .on('close', () => {
    // User closed the app. Kill the host process.
    process.exit();
  });
});