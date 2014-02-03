exports = module.exports = function(ngModule) {

    ngModule.provider('reCAPTCHA', function() {
        var _publicKey = null,
            _options = {};

        this.setPublicKey = function(publicKey) {
            _publicKey = publicKey;
        };

        this.setOptions = function(options) {
            _options = options;
            _options.custom_theme_widget = (_options.theme||{} === 'custom') ? 'recaptcha_widget' : false;
        };

        function createScript($document, callback) {

            var scriptTag = $document.createElement('script');
            scriptTag.type = 'text/javascript';
            scriptTag.async = true;
            scriptTag.src = '//www.google.com/recaptcha/api/js/recaptcha_ajax.js';
            scriptTag.onreadystatechange = function() {
                if (this.readyState === 'complete') {
                    callback();
                }
            };
            scriptTag.onload = callback;
            var s = $document.getElementsByTagName('body')[0];
            s.appendChild(scriptTag);
        }

        this.$get = function($q, $rootScope, $window, $timeout, $document) {
            var deferred = $q.defer();
            if (!_publicKey) throw new Error('Please provide your PublicKey via setPublicKey');

            if (!$window.Recaptcha) {
                createScript($document[0], deferred.resolve);
            }

            return {
                create: function(element, callback) {
                    _options.callback = callback;
                    deferred.promise.then(function() {
                        $window.Recaptcha.create(
                            _publicKey,
                            element,
                            _options
                        );
                    });
                },
                customTemplate: function(){
                    return ((_options||{}).theme||{}) === 'custom';
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
        };
    });

    ngModule.directive('reCaptcha', function(reCAPTCHA, $compile, $timeout) {
        return {
            restrict: 'AE',
            require: 'ngModel',
            scope: {
                ngModel: '='
            },

            /* jshint multistr: true */
            template:   (reCAPTCHA.customTemplate) ?
                        '<div id="recaptcha_widget"> \
                            <div id="recaptcha_image"></div> \
                            <div class="recaptcha_only_if_incorrect_sol" style="color:red">Incorrect please try again</div> \
                            \
                            <span class="recaptcha_only_if_image">Enter the words above:</span> \
                            <span class="recaptcha_only_if_audio">Enter the numbers you hear:</span> \
                            \
                            <input type="text" id="recaptcha_response_field" name="recaptcha_response_field" /> \
                            \
                            <div><a href="javascript:Recaptcha.reload()">Get another CAPTCHA</a></div> \
                            <div class="recaptcha_only_if_image"><a href="javascript:Recaptcha.switch_type(\'audio\')">Get an audio CAPTCHA</a></div> \
                            <div class="recaptcha_only_if_audio"><a href="javascript:Recaptcha.switch_type(\'image\')">Get an image CAPTCHA</a></div> \
                            \
                            <div><a href="javascript:Recaptcha.showhelp()">Help</a></div> \
                            \
                        </div> \
                            \
                        <noscript> \
                            <iframe src="http://www.google.com/recaptcha/api/noscript?k=your_public_key" height="300" width="500" frameborder="0"></iframe><br> \
                            <textarea name="recaptcha_challenge_field" rows="3" cols="40"> \
                            </textarea> \
                            <input type="hidden" name="recaptcha_response_field" value="manual_challenge"> \
                        </noscript>'
                        : false,

            link: function(scope, element, attrs, controller) {

                var name = attrs.name || 'reCaptcha';

                scope.clear = function(getChallenge) {
                    scope.ngModel = {
                        response: '',
                        challenge: false
                    };
                    if(getChallenge) {
                        $timeout(function () {
                            scope.ngModel.challenge = reCAPTCHA.challenge();
                        }, 200);
                    }
                };

                // Reset on Start
                scope.clear();
                controller.$setValidity(name, false);

                // Create reCAPTCHA
                reCAPTCHA.create(element[0], function() {
                    scope.$apply(function () {
                        scope.ngModel.challenge = reCAPTCHA.challenge();
                    });
                    scope.$watch('ngModel.response', function(response) {
                        controller.$setValidity(name, (response.length === 0 ? false : true));
                    });

                    $compile(element.find('input#recaptcha_response_field').attr('ng-model', 'ngModel.response'))(scope);
                    $compile(element.find('a#recaptcha_reload_btn').attr('ng-click', 'clear(true)'))(scope);

                });

                // Destroy Element
                element.on('destroy', reCAPTCHA.destroy);
            }
        };
    });
};
