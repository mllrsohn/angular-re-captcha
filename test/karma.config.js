module.exports = function(config) {
    config.set({
        basePath: '../',
        frameworks: ['mocha', 'sinon-chai'],
        plugins: [
            'karma-mocha',
            'karma-sinon-chai',
            'karma-chrome-launcher',
            'karma-firefox-launcher'
        ],
        reporters: ['progress'],
        autoWatch: true,
        colors: true
    });
};