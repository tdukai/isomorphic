"use strict";

var gulp = require('gulp');
var path = require('path');
var folders = require('./lib/folders.js');
var plugins = require('gulp-load-plugins')({ camelize: true });
var pkg = require('./package.json');
var bundle = require('./bundle.json');

// View name extraction
function getViewName (file) {
    return file.basename;
}

// Copy source files first (if exists for the type)
function copyFiles (type, done) {
    if (bundle.hasOwnProperty(type) && bundle[type].copy && Array.isArray(bundle[type].copy.src) && typeof bundle[type].copy.dest === 'string') {
        gulp.src(bundle[type].copy.src).pipe(gulp.dest(bundle[type].copy.dest)).once('end', function () {
            if (done) {
                done();
            }
        });
    } else if (done) {
        done();
    }
}

// Find all plugins
var srcPath = path.join(__dirname, 'plugins');
var list = folders(srcPath);
// Update bundle with all the plugin settings
list.forEach(function (folder) {
    var bnd = require(path.join(__dirname, 'plugins', folder, 'bundle.json'));
    var addTobundle = function addTobundle (type, mode, search) {
        bundle[type] = bundle[type] || {};
        bundle[type][mode] = bundle[type][mode] || [];
        if (bnd[type] && Array.isArray(bnd[type][mode])) {
            bnd[type][mode].forEach(function (file) {
                bundle[type][mode].push(path.join('plugins', folder, file));
            });
        } else if (search) {
            bundle[type][mode].push(path.join('plugins', folder, search));
        }
    };
    // Add to bundle
    addTobundle('css', 'client', 'css/**/*.css');
    addTobundle('css', 'vendor', 'vendor/**/*.css');
    addTobundle('sass', 'client', 'sass/**/*.sass');
    addTobundle('sass', 'vendor', 'vendor/**/*.sass');
    addTobundle('js', 'client', 'js/**/*.js');
    addTobundle('js', 'copy');
    addTobundle('js', 'vendor', 'vendor/**/*.js');
    addTobundle('view', 'client', 'view/**/*.dust');
    addTobundle('view', 'server', 'view/**/*.dust');
    // Add tests
    bundle.test.push(path.join('plugins', folder, 'test/**/*.js'));
});


gulp.task('bundle-css', function () {
    // Copy source files first, if needed
    copyFiles('css', function () {
        // Combine all css files
        gulp.src(bundle.css.vendor)
            .pipe(plugins.concat('vendor-' + bundle.versions.vendor + '.min.css'))
            .pipe(gulp.dest('public/css'))
            .pipe(plugins.gzip({
                append: true,
                gzipOptions: {
                    level: 9
                }
            }))
            .pipe(gulp.dest('public/css'));
        return gulp.src(bundle.css.client)
            .pipe(plugins.cssmin())
            .pipe(plugins.concat('client-' + pkg.version + '.min.css'))
            .pipe(gulp.dest('public/css'))
            .pipe(plugins.gzip({
                append: true,
                gzipOptions: {
                    level: 9
                }
            }))
            .pipe(gulp.dest('public/css'));
    });
});


gulp.task('lint', function () {
    return gulp.src(bundle.js.lint)
        .pipe(plugins.expectFile(bundle.js.lint))
        .pipe(plugins.jshint('.jshintrc'))
        .pipe(plugins.jshint.reporter('jshint-stylish'));
});


gulp.task('bundle-js', function () {
    // Copy source files first, if needed
    copyFiles('js', function () {
        // Combine all client code
        gulp.src(bundle.js.client)
            .pipe(plugins.concat('client-' + pkg.version + '.js'))
            .pipe(gulp.dest('public/js'))
            .pipe(plugins.uglify().on('error', plugins.util.log))
            .pipe(plugins.concat('client-' + pkg.version + '.min.js'))
            .pipe(gulp.dest('public/js'))
            .pipe(plugins.gzip({
                append: true,
                gzipOptions: {
                    level: 9
                }
            }))
            .pipe(gulp.dest('public/js'));
        // Combine all library files
        return gulp.src(bundle.js.vendor)
            .pipe(plugins.concat('vendor-' + bundle.versions.vendor + '.min.js'))
            .pipe(gulp.dest('public/js'))
            .pipe(plugins.gzip({
                append: true,
                gzipOptions: {
                    level: 9
                }
            }))
            .pipe(gulp.dest('public/js'));
    });
});


gulp.task('bundle-img', function () {
    // Copy source files first, if needed
    copyFiles('img', function () {
        return gulp.src(bundle.img.client).pipe(gulp.dest('public/img'));
    });
});


gulp.task('bundle-font', function () {
    // Copy source files first, if needed
    copyFiles('font');
});


gulp.task('bundle-view', function () {
    // Copy source files first, if needed
    copyFiles('view', function () {
        // Combine all views for server side
        gulp.src(bundle.view.server)
            .pipe(plugins.expectFile(bundle.view.server))
            .pipe(plugins.replace('{vendorVersion}', bundle.versions.vendor)) // Replace tokens with real version numbers
            .pipe(plugins.replace('{clientVersion}', pkg.version))
            .pipe(plugins.dust({
                name: getViewName,
                preserveWhitespace: false
            }))
            .pipe(plugins.concat('views.min.js'))
            .pipe(gulp.dest('lib'));
        // Combine and compress client side views
        return gulp.src(bundle.view.client)
            .pipe(plugins.expectFile(bundle.view.client))
            .pipe(plugins.dust({
                name: getViewName,
                preserveWhitespace: false
            }))
            .pipe(plugins.concat('views-' + pkg.version + '.min.js'))
            .pipe(gulp.dest('public/js'))
            .pipe(plugins.gzip({
                append: true,
                gzipOptions: {
                    level: 9
                }
            }))
            .pipe(gulp.dest('public/js'));
    });
});


gulp.task('watch', ['bundle'], function () {
    // Start dev server
    plugins.developServer.listen({ path: 'index.js' });

    gulp.watch(bundle.js.lint, function () {
        gulp.start(['lint', 'test', 'bundle-js'], function () {
            plugins.developServer.restart();
        });
    });

    gulp.watch(bundle.css.client, function () {
        gulp.start(['bundle-css'], function () {
            plugins.developServer.restart();
        });
    });

    gulp.watch(bundle.css.server, function () {
        gulp.start(['bundle-css'], function () {
            plugins.developServer.restart();
        });
    });

    gulp.watch(bundle.view.server, function () {
        gulp.start(['bundle-view'], function () {
            plugins.developServer.restart();
        });
    });

    return gulp.watch(bundle.view.client, function () {
        gulp.start(['bundle-view'], function () {
            plugins.developServer.restart();
        });
    });
});


gulp.task('test', function () {
    return gulp.src(bundle.test)
        //.pipe(plugins.lab('--reporter html --output temp/coverage.html'))
        .pipe(plugins.lab('--reporter console'))
        .on('error', plugins.util.log);
});


gulp.task('bundle', ['lint', 'test', 'bundle-js', 'bundle-css', 'bundle-img', 'bundle-font', 'bundle-view']);
gulp.task('default', ['bundle']);