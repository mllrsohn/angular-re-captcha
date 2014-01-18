module.exports = function(config) {
    config.set({
        basePath: '../',
        frameworks: ['mocha'],
        plugins: [
            'karma-mocha',
            'karma-chrome-launcher',
            'karma-firefox-launcher'
        ],
        reporters: ['progress'],
        autoWatch: true,
        colors: true
    });
};