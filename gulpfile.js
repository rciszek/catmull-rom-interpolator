var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglifyes = require('uglify-es');
var composer = require('gulp-uglify/composer');
var uglify = composer(uglifyes, console);
var pump = require('pump');
var rename = require('gulp-rename');
const SRC = 'src/';
const DEST = 'dist/';

gulp.task( 'lint', function() {
	return gulp.src(SRC + '*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'));
} );

gulp.task('minify', function(cb) {
	 pump( [ gulp.src(SRC + '*.js'),
	 uglify(),
	 rename( { suffix : '.min' }),
	 gulp.dest(DEST) ],cb );
});
