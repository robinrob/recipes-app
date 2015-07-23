var config = {
    paths: {
        haml: {
            src: ['**/_haml/*.haml']
        },
        html: {
            src: ['**/*.html'],
        },
        sass: {
            main: '_sass/main.scss',
            src: '_sass/*.scss',
            dest: '_css/'
        },
        css: {
            main: 'styles.css',
            src: '_css/*.css',
            dest: './css/'
        },
        js: {
            //main: 'scripts.js',
            src: ['./js/*.js'],
            //dest: './js/'
        }
    },
    siteUrl: "https://rsmith.io",
    sitemapUrl: "https://rsmith.io/sitemap.xml"
}
config.paths.watch = [
    config.paths.html.src,
    config.paths.sass.src,
    config.paths.js.src
]

var argv = require('yargs').argv
var browserSync = require('browser-sync')
var cloudflare = require('gulp-cloudflare')
var combiner = require('stream-combiner2')
var concat = require('gulp-concat')
var cp = require('child_process')
var gulp = require('gulp')
var haml = require('gulp-ruby-haml')
var imagemin = require('gulp-imagemin');
var minifyCSS = require('gulp-minify-css')
var minifyHTML = require('gulp-minify-html')
var ngmin = require('gulp-ngmin')
var path = require('path')
var plumber = require('gulp-plumber')
var prefix = require('gulp-autoprefixer')
var task = require('gulp-task')
var rename = require('gulp-rename')
var runSequence = require('run-sequence')
var sass = require('gulp-sass')
var shell = require('shelljs/global')
var uglify = require('gulp-uglifyjs')
var watch = require('gulp-watch')

gulp.task('link', function() {
    var pkgJson = require('./package.json')

    var deps = pkgJson.devDependencies
    for (dep in deps) {
        exec('sudo npm link ' + dep + '@' + deps[dep])
    }
})

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
}

function onError(err) {
    shell.exec('say wanker')
}

gulp.task('reload', function () {
    browserSync.reload()
})

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: './'
        },
        browser: 'safari'
    })
})

function hamlBuild() {
    return combiner(
        haml(),
        rename(function (path) {
            path.dirname += '/../'
        })
    )
}

gulp.task('haml-watch', function () {
    gulp.src(config.paths.haml.src, {read: false})
        .pipe(plumber({
            onError: onError
        }))
        .pipe(watch(config.paths.haml.src))
        .pipe(hamlBuild())
        .pipe(gulp.dest('./'))
})

gulp.task('haml-build', function () {
    return gulp.src(config.paths.haml.src)
        .pipe(plumber({
            onError: onError
        }))
        .pipe(hamlBuild())
        .pipe(gulp.dest('./'))
})

gulp.task('html', function () {
    // Overwrite original files
    return gulp.src(config.paths.html.build, {
        base: './'
    })
        .pipe(minifyHTML())
        .pipe(gulp.dest(config.paths.html.dest))
})

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src(config.paths.sass.main)
        .pipe(sass({
            includePaths: [config.paths.sass.src],
            onError: onError
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(gulp.dest(config.paths.sass.dest))
})

gulp.task('css-concat', function () {
    return gulp.src(config.paths.css.src)
        .pipe(concat(config.paths.css.main))
        .pipe(gulp.dest(config.paths.css.dest))
})

gulp.task('css-minify', function () {
    return gulp.src(config.paths.css.dest + '/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest(config.paths.css.dest))
})

gulp.task('css-dev', function (done) {
    runSequence('css-concat', done)
})

gulp.task('css', function (done) {
    runSequence('css-concat', 'css-minify', done)
})

gulp.task('js-concat', function () {
    return gulp.src(config.paths.js.src)
        .pipe(concat(config.paths.js.main))
        .pipe(gulp.dest(config.paths.js.dest))
})

gulp.task('js-minify', function () {
    return gulp.src(config.paths.js.dest + '/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(config.paths.js.dest))
})

gulp.task('js-dev', function (done) {
    runSequence('js-concat', done)
})

gulp.task('js', function (done) {
    runSequence('js-concat', 'js-minify', done)
})

gulp.task('build', function (done) {
    runSequence('haml-build', 'sass', ['css'], 'reload', done)
})

gulp.task('fast-build', function (done) {
    runSequence('sass', ['css'], 'reload', done)
})

gulp.task('dev-build', function (done) {
    runSequence('haml-build', 'sass', ['css-dev', 'js-dev'], 'reload', done)
})

gulp.task('fast-dev-build', function (done) {
    runSequence('sass', 'css-dev', 'reload', done)
})

gulp.task('watch', ['haml-watch'], function () {
    gulp.watch(config.paths.watch, ['fast-build'])
})

gulp.task('dev-watch', ['haml-watch'], function () {
    gulp.watch(config.paths.watch, ['fast-dev-build'])
})

gulp.task('full', function (done) {
    runSequence('build', 'watch', 'browser-sync', done)
})

gulp.task('default', function (done) {
    runSequence('fast-dev-build', 'dev-watch', 'browser-sync', done)
})