var
    gulp = require('gulp'),
    print = require('gulp-print'),
    runSequence = require('run-sequence'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    uglifyCss = require('gulp-minify-css'),
    jade = require('gulp-jade')
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
    return gulp.src(['public/**/*'])
        .pipe(gulp.dest('dist/'))
        ;
});

gulp.task('uglify-js', function (done) {
    return gulp.src('public/scripts/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
        ;
});

gulp.task('uglify-css', function (done) {
    return gulp.src('public/stylesheets/*.css')
        .pipe(uglifyCss())
        .pipe(gulp.dest('dist/stylesheets'))
        ;
});

gulp.task('release', function (done) {
    // Do nothing
    done();
});

gulp.task('jade', function (done) {
    var jadeFiles = [{
        src: './views/footer-template.jade',
        dest: './public/'
    }, {
        src: './views/index-footer-embed.jade',
        dest: './public/'
    }, {
        src: './views/partial/footer-js.jade',
        dest: './public/'
    }];

    return jadeFiles.forEach(function (jf) {
        if (!jf.src || !jf.dest) return;

        gulp.src(jf.src)
            .pipe(jade())
            .pipe(gulp.dest(jf.dest))
        ;
    });
});

module.exports = function (callback) {
    runSequence('build', callback);
};