var
    gulp = require('gulp'),
    print = require('gulp-print'),
    runSequence = require('run-sequence'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    uglifyCss = require('gulp-minify-css'),
    jade = require('gulp-jade'),
    concat = require('gulp-concat')
    ;

gulp.task('build', function (done) {
    runSequence('clean', 'jade', 'copy', 'uglify-js', 'uglify-css', done);
});
gulp.task('default', ['build']);

gulp.task('clean', function (done) {
    return gulp.src('dist', {read: false})
        .pipe(clean())
        ;
});

gulp.task('copy', function (done) {
    // return gulp.src(['public/**/*'])
    //     .pipe(gulp.dest('dist/'))
    //     ;
    done();
});

gulp.task('uglify-js', function (done) {
    return gulp.src(['public/js/*.js'])
        .pipe(uglify())
        .pipe(concat('all-scripts.min.js'))
        .pipe(gulp.dest('public/dist/js'))
        ;
});

gulp.task('uglify-css', function (done) {
    return gulp.src(['public/stylesheets/**/*.css'])
        .pipe(uglifyCss())
        .pipe(concat('all-styles.min.css'))
        .pipe(gulp.dest('public/dist/css'))
        ;
});

gulp.task('release', function (done) {
    // Do nothing
    done();
});

gulp.task('jade', function (done) {
    var jadeFiles = [{
        src: './views/index-footer-embed.jade',
        dest: './public/'
    }];

    return jadeFiles.forEach(function (jf) {
        if (!jf.src || !jf.dest) return;

        gulp.src(jf.src)
            .pipe(jade())
            .pipe(gulp.dest(jf.dest))
        ;

        done();
    });
});

module.exports = function (callback) {
    runSequence('build', callback);
};