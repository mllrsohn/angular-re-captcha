var gulp = require('gulp');
var karma = require('gulp-karma');

gulp.task('test', function() {
    gulp.src([
        'test/mocha.conf.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'bower_components/sinonjs-built/pkg/sinon-1.7.3.js',
        'bower_components/chai/chai.js',
        'angular-re-captcha.js',
        'test/unit/**/*.js'
    ]).pipe(karma({
        configFile: './test/karma.config.js',
        action: (gulp.env.travis ? 'run' : 'watch'),
        browsers: (gulp.env.travis ? ['Firefox'] : ['Chrome']),
        singleRun: (gulp.env.travis ? true : false),
    }));
});