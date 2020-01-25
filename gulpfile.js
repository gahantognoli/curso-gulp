var gulp = require('gulp')
    ,imagemin = require('gulp-imagemin')
    ,clean = require('gulp-clean')
    ,concat = require('gulp-concat')
    ,htmlReplace = require('gulp-html-replace')
    ,uglify = require('gulp-uglify')
    ,usemin = require('gulp-usemin')
    ,cssmin = require('gulp-cssmin')
    ,browserSync = require('browser-sync')
    ,jsHint = require('gulp-jshint')
    ,jsHintStylish = require('jshint-stylish')
    ,cssLint = require('gulp-csslint')
    ,autoPrefixer = require('gulp-autoprefixer')
    ,less = require('gulp-less');


gulp.task('default', ['copy'], function(){
    gulp.start('build-img', 'usemin');
});

gulp.task('copy', ['clean'], function(){
    return gulp.src('src/**/*')
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function(){
    return gulp.src('dist')
        .pipe(clean());
});

gulp.task('build-img', function(){
    gulp.src('dist/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

gulp.task('usemin', function(){
    gulp.src('dist/**/*.html')
        .pipe(usemin({
            'js': [uglify],
            'css': [autoPrefixer, cssmin]
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('server', function(){
    browserSync.init({
        server: {
            baseDir: 'src'
        } 
    });

    gulp.watch('src/js/*.js').on('change', function(event){
        gulp.src(event.path)
            .pipe(jsHint())
            .pipe(jsHint.reporter(jsHintStylish));
    });

    gulp.watch('src/css/*.css').on('change', function(event){
        gulp.src(event.path)
            .pipe(cssLint())
            .pipe(cssLint.reporter());
    });

    gulp.watch('src/less/**/*.less').on('change', function(event){
        gulp.src(event.path)
            .pipe(less().on('error', function(error){
                console.log(error.message);
            }))
            .pipe(gulp.dest('src/css'));
    });

    gulp.watch('src/**/*').on('change', browserSync.reload);
});