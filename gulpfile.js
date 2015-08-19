var browserSync = require('browser-sync')
var browserify = require('browserify')
var buffer = require('vinyl-buffer')
var combiner = require('stream-combiner2')
var concat = require('gulp-concat')
var gulp = require('gulp')
var minifyCSS = require('gulp-minify-css')
var minifyHTML = require('gulp-minify-html')
var path = require('path')
var plumber = require('gulp-plumber')
var prefix = require('gulp-autoprefixer')
var rename = require('gulp-rename')
var rimraf = require('gulp-rimraf')
var runSequence = require('run-sequence')
var sass = require('gulp-sass')
var shell = require('shelljs/global')
var source = require('vinyl-source-stream')
var uglify = require('gulp-uglify')
var watch = require('gulp-watch')
var wrap = require('gulp-wrap')

var buildDir = 'dist'
var stageDir = 'stage'
var paths = {
    html: {
        src: ['index.html', 'partials/*.html'],
        dest: buildDir
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
        src: ['js/*.js'],
        stageSrc: [path.join(stageDir, 'js', '*.js')],
        libs: [path.join('js', 'libs', '*.js')],
        dest: path.join(buildDir, 'js'),
        bower: ['bower_components/jquery/dist/jquery.js', 'bower_components/lodash/lodash.min.js', 'bower_components/angular-aside/dist/js/angular-aside.min.js']
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
    angularBuild: '<span style="color: grey">Running:</span> $ angular build',
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

gulp.task('html', function () {
    // Overwrite original files
    return gulp.src(paths.html.src, { base: './' })
        //.pipe(minifyHTML())
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

gulp.task('bower-components', function() {
    return gulp.src(paths.js.bower)
        .pipe(concat('bower.js'))
        .pipe(gulp.dest(paths.js.dest))
})

gulp.task('js', function () {
    // set up the browserify instance on a task basis
    var b = browserify({
        entries: 'js/app.js',
        debug: true
    });

    return b.bundle()
        .pipe(source('js/app.js'))
        .pipe(buffer())
        .pipe(gulp.dest(path.join(stageDir, paths.js.dir)))
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(paths.js.dest))
});

gulp.task('build', function (done) {
    runSequence('clean', 'html', 'sass', ['css', 'js'], 'reload', done)
})

gulp.task('dev-build', function (done) {
    runSequence('clean', 'html', 'sass', ['css-dev', 'js'], 'reload', done)
})

gulp.task('watch', function () {
    gulp.watch(paths.watch, ['build'])
})

gulp.task('dev-watch', function () {
    gulp.watch(paths.watch, ['dev-build'])
})

gulp.task('full', function (done) {
    runSequence('build', 'watch', 'browser-sync', done)
})

gulp.task('default', function (done) {
    runSequence('dev-build', 'dev-watch', 'browser-sync', done)
})