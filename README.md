# angular-re-captcha [![Bower version][bower-image]][bower-url] [![Build Status][travis-image]][travis-url] 

> Integrate [reCAPTCHA](http://www.google.com/recaptcha) into angularjs with form validation support.

## Install

Install via bower:

```shell
bower install angular-re-captcha --save
```
Include the file into your application:

```html
<script type="text/javascript" src="bower_components/angular-re-captcha/angular-re-captcha.js"></script>
```

### Usage Example
Your can [have a look at the example](example/example.html). Basically you have to add reCAPTCHA to your dependencies, configure your key.

```javascript
angular.module('myApp', ['reCAPTCHA'])
       .config(function (reCAPTCHAProvider) {
            // required: please use your own key :)
            reCAPTCHAProvider.setPublicKey('---KEY---');
            
            // optional: gets passed into the Recaptcha.create call
            reCAPTCHAProvider.setOptions({
                theme: 'clean'
            });
        })
        .controller('AppCtrl', function ($scope, reCAPTCHA) {

            // or you can also set key here
            reCAPTCHA.setPublicKey('---KEY---');

       });
```
and use the directive within a form. Make sure to set a ng-model

```html
<form name="registerForm" role="form" novalidate>
    <div re-captcha ng-model="user.captcha"></div>
    <button type="submit" ng-disabled="registerForm.$invalid">Submit</button>
</form>
```

## API

### reCAPTCHAProvider

#### reCAPTCHAProvider.setPublicKey()
Type: `function`  
Default: `null`

Sets the PublicKey

#### reCAPTCHAProvider.setOptions()
Type: `function`  
Default: `null`

Sets the options, that get passed into the Recaptcha.create call. Here are a list of the [available options](https://developers.google.com/recaptcha/docs/customization)


### reCAPTCHA

#### reCAPTCHA.setPublicKey()
Type: `function`
Default: `null`

Sets the PublicKey

## Custom Themes

Custom themes configure recaptcha to use existing elements instead of injecting elements for you.
Refer to https://developers.google.com/recaptcha/docs/customization for additional documentation and example widgets.

```javascript
// Configure the template to use a custom widget.
reCAPTCHAProvider.setOptions({
    theme: 'custom',
    custom_theme_widget: 'recaptcha_widget' // The id of your widget element.
});    
```

```html
<div re-captcha ng-model="user.captcha" id="recaptcha_widget" style="display:none">
    <div id="recaptcha_image"></div>
    <img id="recaptcha_logo" alt="" src="https://www.google.com/recaptcha/api/img/clean/logo.png">
    <input type="text" id="recaptcha_response_field" name="recaptcha_response_field" />
</div>
```

## Contribute
Pull requests are welcome. Please make sure that you include tests in your PR.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[bower-url]: http://badge.fury.io/bo/angular-re-captcha
[bower-image]: https://badge.fury.io/bo/angular-re-captcha.png

[travis-url]: http://travis-ci.org/mllrsohn/angular-re-captcha
[travis-image]: https://secure.travis-ci.org/mllrsohn/angular-re-captcha.png?branch=master
