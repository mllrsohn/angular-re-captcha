module.exports = function(config) {
    config.set({
        basePath: '../',
        frameworks: ['mocha'],
        plugins: [
            'karma-mocha',
            'karma-chrome-launcher'
        ],
        reporters: ['progress'],
        browsers: ['Chrome'],
        autoWatch: true,
        singleRun: false,
        colors: true
    });
};