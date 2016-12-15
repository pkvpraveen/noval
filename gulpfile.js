/* jshint -W079 */
var gulp = require('gulp');
var config = require('./gulp.config')();
var args = require('yargs').argv;
var $ = require('gulp-load-plugins')({lazy: true});
var del = require('del');

gulp.task('vet', function () {
    log('working with gulp');
    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('wiredep', function () {
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;
    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js), {relative: true}))
        .pipe(gulp.dest(config.root));
});

gulp.task('inject', ['wiredep'], function () {
    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css), {relative: true}))
        .pipe(gulp.dest(config.root));
});
gulp.task('clean-fonts', function () {
    return clean(config.build + 'fonts/**');
});
gulp.task('fonts', ['clean-fonts'], function () {
    log('Copying fonts...');
    return gulp.src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
});

gulp.task('clean-images', function () {
    return clean(config.build + 'images/**');
});
gulp.task('images', ['clean-images'], function () {
    log(' Copying and compressing images');
    return gulp.src(config.images)
        .pipe($.imagemin({optimizationLevel: 4}))
        .pipe(gulp.dest(config.build + 'images'));
});

gulp.task('clean-img', function () {
    return clean(config.build + 'img/**');
});
gulp.task('clean-css', function () {
    return clean(config.build + 'styles/**');
});

gulp.task('img', ['clean-img'], function () {
    log(' Copying and compressing images');
    return gulp.src(config.img)
        .pipe($.imagemin({optimizationLevel: 4}))
        .pipe(gulp.dest(config.build + 'img'));
});

gulp.task('optimize', ['inject','clean-css'], function () {
    log('Optimizing html, js and css');
    var assets = $.useref.assets({searchPath: './'});
    var cssFilter = $.filter('**/*.css', {restore: true});
    var libjsFilter = $.filter('**/lib.js', {restore: true});
    var appjsFilter = $.filter('**/app.js', {restore: true});
    return gulp.src(config.index)
        .pipe($.plumber())
        .pipe(assets)
        //filter down to css
        .pipe(cssFilter)
        //csso
        .pipe($.csso())
        //filter restore
        .pipe(cssFilter.restore)
        //filter down to js
        .pipe(libjsFilter)
        //uglify
        .pipe($.uglify())
        //filter restore
        .pipe(libjsFilter.restore)
        //filter down to js
        .pipe(appjsFilter)
        //uglify
        .pipe($.uglify())
        //filter restore
        .pipe(appjsFilter.restore)
        //file revisions
        .pipe($.rev())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(gulp.dest(config.build))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(config.build))
        .pipe($.connect.reload());
});

gulp.task('build', ['optimize', 'images', 'img', 'fonts','connect'], function () {
    log('building everything...');
    return gulp.watch([config.css,config.js,config.index], ['optimize']);
});

gulp.task('connect', function () {
    $.connect.server({
        root: [config.build],
        livereload: true,
        open: {browser: 'Google Chrome'}
    });
});

gulp.task('watch',function(){

});

//*****************************************************

function log(msg) {
    if (typeof(msg) === Object) {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.green(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.green(msg));
    }
}

function clean(path) {
    log('deleting file' + path);
    return del(path);
}
