var gulp = require('gulp');


var changed = require('gulp-changed');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var minifyHtml = require('gulp-minify-html');
var order = require('gulp-order');
var sass = require('gulp-sass');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');


gulp.task('default', ['watch']);

// give me hints about my js
gulp.task('jshint', function() {
	gulp.src('./dest/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// image optimization for new and updated images
gulp.task('imagemin', function() {
	var imgSrc = './src/img/**/*',
		imgDest = './dest/img';

	gulp.src(imgSrc)
		.pipe(changed(imgDest))
		.pipe(imagemin())
		.pipe(gulp.dest(imgDest));
});

// minify HTML files when they are changed
gulp.task('minifyHtml', function() {
	var htmlSrc = './src/templates/*.html',
		htmlDest = './dest/';

	gulp.src(htmlSrc)
		.pipe(changed(htmlDest))
		.pipe(minifyHtml())
		.pipe(gulp.dest(htmlDest));
});

// JS - concatenate, strip debugging, and minify
gulp.task('scripts', function() {
	gulp.src([
		"src/js/lib/angular.js",
		"src/js/lib/angular-ui-router.js",
		"src/js/lib/angular-cookies.js",
		"src/js/app.js",
		"src/js/controllers.js",
		"src/js/directives.js"
	])

	.pipe(concat('script.js'))
	//.pipe(stripDebug())
	//.pipe(uglify())
	.pipe(gulp.dest('./dest/js/'));
});

// compile .scss into .css
gulp.task('sass', function() {
	gulp.src('./src/styles/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./dest/styles/'));
});

gulp.task('watch', function() {
	gulp.watch('src/templates/*.html', ['minifyHtml']);
	gulp.watch('src/js/*.js', ['scripts']);
	gulp.watch('src/styles/*.scss', ['sass']);
});

