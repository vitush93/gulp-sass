var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    buffer = require('gulp-buffer'),
    source = require('vinyl-source-stream'),
    browserifyHandlebars = require('browserify-handlebars');


// JS compilation
gulp.task('js', function () {
    return browserify('./src/js/main.js', {debug: true})
        .transform(babelify, {
            presets: ['es2015']
        })
        .transform(browserifyHandlebars)
        .bundle()
        .pipe(source('./main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))

        //only uglify if --type production
        .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'));
});


// SASS compilation
gulp.task('css', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))

        // only minify if --type production
        .pipe(gutil.env.type === 'production' ? cssnano() : gutil.noop())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css/'));
});


//  Default task
gulp.task('default', ['js', 'css'], function () {
    gulp.watch('src/scss/**/*.scss', ['css']);
    gulp.watch('src/js/**/*.js', ['js']);
});