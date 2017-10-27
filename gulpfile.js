var gulp = require('gulp');

var clean = require('gulp-clean');
var merge = require('merge-stream');
var foreach = require('gulp-foreach');
var inline = require('gulp-inline-fonts');
var concat = require('gulp-concat');
let cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var htmlReplace = require('gulp-html-replace');

gulp.task('clean-build', () => {
	return gulp.src('build', {
			read: false
		})
		.pipe(clean({ force: true }));
});

gulp.task('clean-dist', ['clean-build'], () => {
	return gulp.src('dist', {
			read: false
		})
		.pipe(clean({ force: true }));
});

gulp.task('copy-css', ['clean-dist'], () => {
	return gulp.src([
					'!font.css', // <== !
					'*.css'
				])
			   .pipe(gulp.dest('build'));
});

gulp.task('fonts', ['copy-css'], () => {
	// create an accumulated stream 
	var fontStream = merge();

	gulp.src('fonts/**/*.woff')
		.pipe(foreach((stream, file) => {

			const fileName = file.relative.split('/')[1];
			const splitFileName = fileName.split('-');
			const nameFont = splitFileName[0];
			const styleFont = splitFileName[1].replace(/\.[^/.]+$/, '');

			fontStream.add(gulp.src(file.path)
				.pipe(inline({
					name: nameFont,
					format: ['woff'],
					style: styleFont
				}))
			);

			return stream;
		}));

		return fontStream.pipe(concat('font.css')).pipe(gulp.dest('build'))
});

gulp.task('clean-css', ['fonts'], () => {
	return gulp.src('build/brotherhood.css')
		.pipe(cleanCSS({
			compatibility: 'ie8'
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('copy-index', ['clean-css'], () => {
	gulp.src('index.html')
		.pipe(htmlReplace({
			'css': 'brotherhood.min.css'
		}))
		.pipe(gulp.dest('dist/'));
});

gulp.task('default', ['copy-index'], () => {
	gulp.start('clean-build');
});