var gulp = require('gulp');
let cleanCSS = require('gulp-clean-css');
var clean = require('gulp-clean');
var rename = require('gulp-rename');

gulp.task('default', ['clean', 'clean-css', 'copy-fonts']);

gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('clean-css', () => {
	return gulp.src('brotherhood.css')
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('copy-fonts', () => {
	gulp.src('fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));
});