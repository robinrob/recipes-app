var argv = require('yargs').argv
var browserSync = require('browser-sync')
var cloudflare = require('gulp-cloudflare')
var combiner = require('stream-combiner2')
var concat = require('gulp-concat')
var cp = require('child_process')
var folders = require('gulp-folders')
var gulp = require('gulp')
var haml = require('gulp-ruby-haml')
var imagemin = require('gulp-imagemin');
var minifyCSS = require('gulp-minify-css')
var minifyHTML = require('gulp-minify-html')
var path = require('path')
var plumber = require('gulp-plumber')
var prefix = require('gulp-autoprefixer')
var task = require('gulp-task')
var rename = require('gulp-rename')
var rimraf = require('gulp-rimraf')
var runSequence = require('run-sequence')
var sass = require('gulp-sass')
var shell = require('shelljs/global')
var uglify = require('gulp-uglifyjs')
var watch = require('gulp-watch')
var wrap = require('gulp-wrap')

var buildDir = 'dist'
var stageDir = 'stage'
var paths = {
    haml: {
        src: ['**/*.haml'],
        dest: buildDir
    },
    html: {
        src: ['**/*.html']
    },
    sass: {
        main: 'sass/main.scss',
        src: 'sass/*.scss',
        dest: path.join(stageDir, 'css')
    },
    css: {
        main: 'styles.css',
        src: [path.join('lib-css', '*.css'), path.join(stageDir, 'css', '*.css')],
        dest: path.join(buildDir, 'css')
    },
    js: {
        main: 'scripts.js',
        dir: 'js',
        src: [path.join('js', '*.js')],
        stageSrc: [path.join(stageDir, 'js', '*.js')],
        libs: [path.join('js', 'libs', '*.js')],
        dest: path.join(buildDir, 'js')
    }
}
paths.watch = [
    paths.html.src,
    paths.sass.src,
    paths.js.src
]

gulp.task('link', function() {
    var pkgJson = require('./package.json')

    var deps = pkgJson.devDependencies
    for (dep in deps) {
        exec('sudo npm link ' + dep + '@' + deps[dep])
    }
})

var messages = {
    angularBuild: '<span style="color: grey">Running:</span> $ angular build'
}

function onError(err) {
    shell.exec('say wanker')
}

gulp.task('clean', function() {
    return gulp.src([path.join(buildDir, '**', '*'), path.join(stageDir, '**', '*')], {read: false})
        .pipe(rimraf())
})

gulp.task('fast-clean', function() {
    return gulp.src(['!dist/**/*.html', '!dist/partials/', path.join(buildDir, '**', '*'), path.join(stageDir, '**', '*')], {read: false})
        .pipe(rimraf())
})

gulp.task('reload', function () {
    browserSync.reload()
})

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: buildDir
        },
        browser: 'safari'
    })
})

function hamlBuild() {
    return combiner(
        haml()
    )
}

gulp.task('haml-watch', function () {
    gulp.src(paths.haml.src, {read: false})
        .pipe(plumber({
            onError: onError
        }))
        .pipe(watch(paths.haml.src))
        .pipe(hamlBuild())
        .pipe(gulp.dest(paths.haml.dest))
})

gulp.task('haml-build', function () {
    return gulp.src(paths.haml.src)
        .pipe(plumber({
            onError: onError
        }))
        .pipe(hamlBuild())
        .pipe(gulp.dest(paths.haml.dest))
})

gulp.task('html', function () {
    // Overwrite original files
    return gulp.src(paths.html.build, {
        base: './'
    })
        .pipe(minifyHTML())
        .pipe(gulp.dest(paths.html.dest))
})

gulp.task('sass', function () {
    return gulp.src(paths.sass.main)
        .pipe(sass({
            includePaths: [paths.sass.src],
            onError: onError
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(gulp.dest(paths.sass.dest))
})

gulp.task('css-concat', function () {
    return gulp.src(paths.css.src)
        .pipe(concat(paths.css.main))
        .pipe(gulp.dest(paths.css.dest))
})

gulp.task('css-minify', function () {
    return gulp.src(paths.css.dest + '/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest(paths.css.dest))
})

gulp.task('css-dev', function (done) {
    runSequence('css-concat', done)
})

gulp.task('css', function (done) {
    runSequence('css-concat', 'css-minify', done)
})

gulp.task('js-src-wrap', function() {
    return gulp.src(paths.js.src)
        .pipe(wrap('(function(){"use strict";<%= contents %>})();'))
        .pipe(rename(function(pathObj) {
            pathObj.dirname = pathObj.dirname
        }))
        .pipe(gulp.dest(path.join(stageDir, paths.js.dir)))
})

gulp.task('js-src', ['js-src-wrap'])

gulp.task('js-concat', function () {
    return gulp.src((paths.js.libs).concat(['!js/libs/angular-mocks.js']).concat(paths.js.stageSrc))
        .pipe(concat(paths.js.main))
        .pipe(gulp.dest(path.join(buildDir, paths.js.dir)))
})

gulp.task('js-minify', function () {
    return gulp.src(path.join(buildDir, paths.js.dir, paths.js.main), {base: './'})
        .pipe(uglify())
        .pipe(gulp.dest('.'))
})

gulp.task('js-dev', function (done) {
    runSequence('js-src', 'js-concat', done)
})

gulp.task('js', function (done) {
    runSequence('js-src', 'js-concat', 'js-minify', done)
})

gulp.task('build', function (done) {
    runSequence('clean', 'haml-build', 'sass', ['css', 'js'], 'reload', done)
})

gulp.task('fast-build', function (done) {
    runSequence('fast-clean', 'sass', ['css', 'js'], 'reload', done)
})

gulp.task('dev-build', function (done) {
    runSequence('clean', 'haml-build', 'sass', ['css-dev', 'js-dev'], 'reload', done)
})

gulp.task('fast-dev-build', function (done) {
    runSequence('fast-clean', 'sass', ['css-dev', 'js-dev'], 'reload', done)
})

gulp.task('watch', ['haml-watch'], function () {
    gulp.watch(paths.watch, ['fast-build'])
})

gulp.task('dev-watch', ['haml-watch'], function () {
    gulp.watch(paths.watch, ['fast-dev-build'])
})

gulp.task('full', function (done) {
    runSequence('build', 'watch', 'browser-sync', done)
})

gulp.task('default', function (done) {
    runSequence('fast-dev-build', 'dev-watch', 'browser-sync', done)
})