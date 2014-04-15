var gulp = require('gulp');
var karma = require('gulp-karma');
var bump = require('gulp-bump');
var git = require('gulp-git');

// Testing
gulp.task('test', function() {
    gulp.src([
        'test/mocha.conf.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'angular-re-captcha.js',
        'test/unit/**/*.js'
    ]).pipe(karma({
        configFile: './test/karma.config.js',
        action: (gulp.env.travis ? 'run' : 'watch'),
        browsers: (gulp.env.travis ? ['Firefox'] : ['Chrome']),
        singleRun: (gulp.env.travis ? true : false),
    }));
});

// Dump the version
gulp.task('bump', function() {
    gulp.src('./package.json')
        .pipe(bump())
        .pipe(gulp.dest('./'));

    gulp.src('./bower.json')
        .pipe(bump())
        .pipe(gulp.dest('./'));

});

// Tag the repo with a version
gulp.task('tag', function() {
    var pkg = require('./package.json');
    var version = 'v' + pkg.version;
    gulp.src('./')
        .pipe(git.tag(version, 'Release ('+version+')')).on('error', console.log);
});