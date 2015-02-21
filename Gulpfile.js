// Gulpfile.js
// Require the needed packages
var gulp        = require('gulp'),
    browserify  = require('gulp-browserify'),
    gutil       = require('gulp-util'),
    clean       = require('gulp-clean'),
    coffee      = require('gulp-coffee'),
    stylus      = require('gulp-stylus'),
    rename      = require('gulp-rename'),
    ejs         = require("gulp-ejs"),
    path        = require("path"),
    fs          = require('fs.extra'),
    del         = require('del'),
    runSequence = require('run-sequence'),
    sourcemaps  = require('gulp-sourcemaps');

var baseAppPath = path.join(__dirname,  'assets'),
    baseStaticPath = path.join(__dirname, 'app'),
    baseJsPath = path.join(baseAppPath, 'js'),
    baseCssPath = path.join(baseAppPath, 'css');

var paths = {
  cleanPath      : [
    path.join(baseStaticPath, 'css', '**', '*'),
    path.join(baseStaticPath, 'fonts', '**', '*'),
    path.join(baseStaticPath, 'img', '**', '*'),
    path.join(baseStaticPath, 'css', '**', '*'),
    path.join(baseStaticPath, 'index.html')
  ],
  cssInput       : path.join(baseCssPath, 'main.styl'),
  cssOutput      : path.join(baseStaticPath, 'css'),
  coffeeInput    : path.join(baseJsPath, '**', '*.coffee'),
  coffeeOutput   : path.join(baseStaticPath, 'js'),
  ejsPath        : [path.join(baseAppPath, '**', '*.ejs')],
  assetsBasePath : baseAppPath,
  assetsPaths: [
    path.join(baseAppPath, 'img', '**', '*'),
    path.join(baseAppPath, 'fonts', '**', '*'),
    path.join(baseAppPath, '**', '*.html'),
    path.join(baseAppPath, 'package.json')
  ],
  assetsOutput: baseStaticPath
};

var watchPaths = {
  css: [
    path.join(baseCssPath, '**', '*.styl*'),
    baseCssPath, path.join('**', '*', '*.styl*')
  ],
  coffee: [path.join(baseJsPath, '**', '*.coffee')],
  assets: paths.assetsPaths,
  ejs: paths.ejsPath
};

var testFiles = [
  'generated/js/app.js',
  'test/client/*.js'
];


gulp.task('test', function() {
  // Be sure to return the stream
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});


//
// Stylus
//


// Get and render all .styl files recursively
gulp.task('stylus', function () {
  gulp.src(paths.cssInput)
    .pipe(stylus()
      .on('error', gutil.log)
      .on('error', gutil.beep))
    .pipe(gulp.dest(paths.cssOutput));

  gulp.src(path.join(baseCssPath, "old.styl"))
    .pipe(stylus()
      .on('error', gutil.log)
      .on('error', gutil.beep))
    .pipe(gulp.dest(paths.cssOutput));
});


//
// Coffee
//

gulp.task('coffee', function() {
  return gulp.src(paths.coffeeInput, { read: false })
    .pipe(browserify({
      basedir: __dirname,
      transform: ['coffeeify'],
      extensions: ['.coffee']
    }).on('error', gutil.log)
      .on('error', gutil.beep))
    .pipe(rename('app.js'))
    .pipe(gulp.dest(paths.coffeeOutput));
});


//
// EJS
//

gulp.task('ejs', function() {
  gulp.src(paths.ejsPath)
    .pipe(ejs()
      .on('error', gutil.log)
      .on('error', gutil.beep))
    .pipe(gulp.dest(paths.assetsOutput));
});


//
// Static Assets
//

gulp.task('assets', function() {
  gulp.src(paths.assetsPaths, {base: paths.assetsBasePath})
    .on('error', gutil.log)
    .on('error', gutil.beep)
    .pipe(gulp.dest(paths.assetsOutput));
});


//
// Clean
//

gulp.task('clean', function() {
  gulp.src(path.join(baseStaticPath, '**', '*'), {read: false})
    .pipe(clean());
});


//
// Watch
//
gulp.task('watch', ['clean','stylus','coffee','assets','ejs'], function() {
  gulp.watch(watchPaths.css, ['stylus'])
    .on('error', gutil.log)
    .on('error', gutil.beep);
  gulp.watch(watchPaths.coffee, ['coffee'])
    .on('error', gutil.log)
    .on('error', gutil.beep);
  gulp.watch(watchPaths.assets, ['assets'])
    .on('error', gutil.log)
    .on('error', gutil.beep);
  gulp.watch(watchPaths.ejs, ['ejs'])
    .on('error', gutil.log)
    .on('error', gutil.beep);

});

gulp.task('default', ['stylus', 'coffee', 'assets', 'ejs']);
