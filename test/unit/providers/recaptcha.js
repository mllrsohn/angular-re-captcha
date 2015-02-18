'use strict';

describe('Provider - reCAPTCHA', function() {
    var expect = chai.expect,
        testKey = '6LfyK-0SAAAAAAl6V9jBGQgPxemtrpIZ-SPDPd-n';

    describe('Provider without publicKey', function() {
        beforeEach(module('reCAPTCHA'));
        it('should throw an error if the publicKey is not set', inject(function(reCAPTCHA) {
            var element = angular.element('<div></div>');
            expect(reCAPTCHA.create.bind(element[0], angular.noop)).to.throw (Error);
        }));

    });

    describe('Provider Script Tag I', function() {
        var createElementSpy;

        beforeEach(function() {
            window.Recaptcha = {
                create: function () {
                }
            };

            module('reCAPTCHA', function(reCAPTCHAProvider) {
                createElementSpy = sinon.spy(reCAPTCHAProvider, '_createScript');
                reCAPTCHAProvider.setPublicKey(testKey);
            });
        });

        afterEach(function () {
            delete window.Recaptcha;
            createElementSpy.restore();
        });

        it('should not create a script tag if there is a window.Recaptcha instance', inject(function(reCAPTCHA) {
            expect(createElementSpy.called).not.to.be.true;
        }));
    });

    describe('Provider Script Tag II', function() {
        var createElementSpy;

        beforeEach(function() {
            module('reCAPTCHA', function(reCAPTCHAProvider) {
                createElementSpy = sinon.spy(reCAPTCHAProvider, '_createScript');
                reCAPTCHAProvider.setPublicKey(testKey);
            });
        });

        afterEach(function() {
            createElementSpy.restore();
        });

        it('should not throw an error', inject(function(reCAPTCHA) {
            var element = angular.element('<div></div>');
            expect(reCAPTCHA.create.bind(element[0], angular.noop)).not.to.throw(Error);
        }));

        it('should create a script tag', inject(function(reCAPTCHA, $rootScope) {
            $rootScope.$apply();
            expect(createElementSpy.called).to.be.ok;
        }));

    });

    describe('Provider Functions', function() {
        var createSpy;

        beforeEach(function() {
            module('reCAPTCHA', function(reCAPTCHAProvider) {
                reCAPTCHAProvider.setPublicKey(testKey);
                reCAPTCHAProvider.setOptions({
                    theme: 'yellow'
                });
            });

            window.Recaptcha = {
                create: sinon.spy(),
                get_response: sinon.spy(),
                get_challenge: sinon.spy(),
                destroy: sinon.spy()
            };
        });

        it('should call create an reCAPTCHA with the key', inject(function(reCAPTCHA, $rootScope) {
            var element = angular.element('<div></div>');
            reCAPTCHA.create(element[0]);
            $rootScope.$apply();
            expect(window.Recaptcha.create.called).to.be.true;
            expect(window.Recaptcha.create.args[0][0]).to.equal(testKey);
            var options = window.Recaptcha.create.args[0][2];
            expect(options.theme).to.equal('yellow');
        }));

        it('should call get_response on Recaptcha', inject(function(reCAPTCHA) {
            reCAPTCHA.response();
            expect(window.Recaptcha.get_response.called).to.be.true;
        }));

        it('should call get_challenge on Recaptcha', inject(function(reCAPTCHA) {
            reCAPTCHA.challenge();
            expect(window.Recaptcha.get_challenge.called).to.be.true;
        }));

        it('should call destroy on Recaptcha', inject(function(reCAPTCHA) {
            reCAPTCHA.destroy();
            expect(window.Recaptcha.destroy.called).to.be.true;
        }));
    });

    describe('Factory Functions', function() {

        beforeEach(function() {

            module('reCAPTCHA', function(reCAPTCHAProvider) {
            });

            window.Recaptcha = {
                create        : sinon.spy(),
                get_response  : sinon.spy(),
                get_challenge : sinon.spy(),
                destroy       : sinon.spy()
            };
        });

        it('should call create an reCAPTCHA with the key set via factory method',
            inject(function(reCAPTCHA, $rootScope) {
                var element = angular.element('<div></div>');
                reCAPTCHA.setPublicKey(testKey);
                reCAPTCHA.create(element[0]);
                $rootScope.$apply();
                expect(window.Recaptcha.create.called).to.be.true;
                expect(window.Recaptcha.create.args[0][0]).to.equal(testKey);
            }));

    });

});