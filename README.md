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

## Contribute
Pull requests are welcome. Please make sure that you include tests in your PR.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[bower-url]: http://badge.fury.io/bo/angular-re-captcha
[bower-image]: https://badge.fury.io/bo/angular-re-captcha.png

[travis-url]: http://travis-ci.org/mllrsohn/angular-re-captcha
[travis-image]: https://secure.travis-ci.org/mllrsohn/angular-re-captcha.png?branch=master