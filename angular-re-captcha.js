angular.module('reCAPTCHA', []).provider('reCAPTCHA', function() {
    var _publicKey = null,
        _options = {},
        self = this;

    this.setPublicKey = function(publicKey) {
        _publicKey = publicKey;
    };

    this.setOptions = function(options) {
        _options = options;
    };

    this._createScript = function($document, callback) {
        var scriptTag = $document.createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;
        scriptTag.src = '//www.google.com/recaptcha/api/js/recaptcha_ajax.js';
        scriptTag.onreadystatechange = function() {
            if (this.readyState == 'complete') {
                callback();
            }
        };
        scriptTag.onload = callback;
        var s = $document.getElementsByTagName('body')[0];
        s.appendChild(scriptTag);
    };

    this.$get = ['$q', '$rootScope', '$window', '$timeout', '$document', function($q, $rootScope, $window, $timeout, $document) {
        var deferred = $q.defer();

        if (!$window.Recaptcha) {
            self._createScript($document[0], deferred.resolve);
        } else {
            deferred.resolve();
        }

        return {
            create: function(element, callback) {
                if (!_publicKey) {
                    throw new Error('Please provide your PublicKey via setPublicKey');
                }
                _options.callback = callback;

                deferred.promise.then(function() {
                    $window.Recaptcha.create(
                        _publicKey,
                        element,
                        _options
                    );
                });
            },
            response: function() {
                return $window.Recaptcha.get_response();
            },
            challenge: function() {
                return $window.Recaptcha.get_challenge();
            },
            destroy: function() {
                $window.Recaptcha.destroy();
            }
        };
    }];

}).directive('reCaptcha', ['reCAPTCHA', '$compile', '$timeout', function(reCAPTCHA, $compile, $timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '='
        },
        link: function(scope, element, attrs, controller) {
            var name = attrs.name || 'reCaptcha';
            scope.clear = function() {
                scope.ngModel = {
                    response: '',
                    challenge: false
                };
                $timeout(function () {
                    scope.ngModel.challenge = reCAPTCHA.challenge();
                },250);
            };

            // Create reCAPTCHA
            reCAPTCHA.create(element[0], function() {

                // Reset on Start
                scope.clear();
                controller.$setValidity(name, false);

                // Watch for changes to setValidity
                scope.$watch('ngModel.response', function(response) {
                    controller.$setValidity(name, (response.length === 0 ? false : true));
                });

                // Attach model and click handler
                $compile(angular.element(document.querySelector('input#recaptcha_response_field')).attr('ng-model', 'ngModel.response'))(scope);
                $compile(angular.element(document.querySelector('a#recaptcha_reload_btn')).attr('ng-click', 'clear()'))(scope);

            });

            // Destroy Element
            scope.$on('$destroy', reCAPTCHA.destroy);
        }
    };
}]);
