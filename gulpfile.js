var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var minifyjs = require('gulp-js-minify');
var babel = require('gulp-babel');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var fs = require("fs");
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var print = require('gulp-print');

var config = {
    srcCss: 'src/sass/**/*.sass',
    buildCss: 'build/css',
    
    srcJs: 'src/js/socialbar.js',
    buildJs: 'build/js',
    watchJs: 'src/js/**/*.js'
};

gulp.task('build', function (cb) {
    gulp.src(config.srcCss)

        // output non-minified CSS file
        .pipe(sass({
            outputStyle: 'expanded',
            includePaths: require('node-bourbon').includePaths
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(config.buildCss))

        // output the minified version
        .pipe(minCss())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(config.buildCss));    

    cb();
});

// gulp.task("scripts", function(cb) {
//     gulp.src(config.srcJs)
//         // output non-minified JS file
//         .pipe(babel({ presets: ['es2015'] }))
//         .pipe(gulp.dest(config.buildJs))
        
//         // output minified javascript
//         .pipe(minifyjs())
//         .pipe(rename({ extname: '.min.js' }))
//         .pipe(gulp.dest(config.buildJs));
// });

gulp.task("scripts", function(cb) {
    browserify({
        entries: config.srcJs,
        debug: true
    })
        // output non-minified JS file
        .transform(["babelify", { presets: ["es2015"] }])
        .on('error', gutil.log)
        .bundle()
        .on('error', gutil.log)
        .pipe(source('socialbar.js'))
        .pipe(buffer())
        .pipe(print(function(filepath) {
            return "Completed: " + filepath;
        }))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.buildJs))
        // output the minified version
        .pipe(minifyjs())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(config.buildJs));
    cb();
});

gulp.task('watch', function (cb) {
    gulp.watch(config.srcCss, ['build']);
    gulp.watch(config.watchJs, ['scripts']);
});

gulp.task('default', ['build', 'scripts']);