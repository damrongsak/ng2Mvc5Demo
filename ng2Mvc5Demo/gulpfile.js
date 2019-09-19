var ts = require('gulp-typescript');
var gulp = require('gulp');
var clean = require('gulp-clean');

const browserSync = require('browser-sync').create();
reload = browserSync.reload;

var destPath = './libs/';

var Paths = {
    HERE: './',
    DIST: 'dist/',
    CSS: './Content/css/',
    SCSS_TOOLKIT_SOURCES: './Content/scss/paper-dashboard.scss',
    SCSS: './Content/scss/**/**'
  };

// Delete the dist directory
gulp.task('clean', () => {
    return gulp.src(destPath)
        .pipe(clean());
});

gulp.task("scriptsNStyles", () => {
    gulp.src([
            'core-js/client/*.js',
            'systemjs/dist/*.js',
            'reflect-metadata/*.js',
            'rxjs/**',
            'zone.js/dist/*.js',
            '@angular/**/bundles/*.js',            
            'bootstrap/dist/js/*.js'
    ], {
        cwd: "node_modules/**"
    })
        .pipe(gulp.dest("./libs"));
});

var tsProject = ts.createProject('tsScripts/tsconfig.json', {
    typescript: require('typescript')
});

gulp.task('ts', (done) => {
    //var tsResult = tsProject.src()
    var tsResult = gulp.src([
            "tsScripts/*.ts"
    ])
        .pipe(tsProject(), undefined, ts.reporter.fullReporter());
    return tsResult.js.pipe(gulp.dest('./Scripts'));
});

gulp.task('watch.ts', gulp.series('ts', () => {
    return gulp.watch('tsScripts/*.ts', gulp.series('ts'));
}));

gulp.task('watch', gulp.series('watch.ts'));

function open() {
    browserSync.init({
        open: 'external',
        proxy: 'http://localhost/ng2/',
        port: 80
    });

    gulp.watch('./Views/**/*.cshtml').on('change', browserSync.reload);
    gulp.watch('./Controllers/*.cs').on('change', browserSync.reload);
    gulp.watch('./Scripts/**/*.js').on('change', browserSync.reload);
}


exports.open = open;

gulp.task('default', gulp.parallel('scriptsNStyles', 'watch'));
