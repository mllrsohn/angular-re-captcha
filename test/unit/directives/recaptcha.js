'use strict';

describe('Directive - reCAPTCHA', function() {
    var expect = chai.expect,
        elm, scope, ctrl,
        testKey = '6LfyK-0SAAAAAAl6V9jBGQgPxemtrpIZ-SPDPd-n',
        parentFormCtrl,
        mockHTML = '<input type="text" id="recaptcha_response_field"><a id="recaptcha_reload_btn">regenerate</a>';

    beforeEach(function() {
        module('reCAPTCHA', function(reCAPTCHAProvider) {
            reCAPTCHAProvider.setPublicKey(testKey);
        });

        window.Recaptcha = {
            create: function (key, element, options) {
                angular.element(element).html(mockHTML);
                options.callback();
            },
            get_response: sinon.spy(),
            get_challenge: function () {
                return 'test';
            },
            destroy: sinon.spy()
        };

        inject(function($rootScope, $compile, $controller, $timeout) {
            elm = angular.element('<div re-captcha ng-model="captcha"></div>');
            scope = $rootScope;
            $compile(elm)(scope);
            scope.$digest();
            $timeout.flush();
        });
    });

    it('should call clear and set the value', function() {
        expect(scope.captcha.response).to.equal('');
        expect(scope.captcha.challenge).to.equal('test');
    });

    it('should call destory', function() {
        scope.$destroy();
        expect(window.Recaptcha.destroy.called).to.be.true;
    });

});