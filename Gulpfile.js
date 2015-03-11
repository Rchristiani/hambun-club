var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function() {
	gulp.src('public/scss/**.scss')
		.pipe(sass({
			errLogToConsole: true
		}))
		.pipe(gulp.dest('public/css'));
});

gulp.task('default', function() {
	gulp.watch('public/scss/**.scss',['sass']);
});