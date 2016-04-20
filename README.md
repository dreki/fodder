# fodder
**feature oriented development**

fodder provides a new way to write applications. It looks like this:

```js
// your features.js file. this is where you define all your app's features
var feature = require('fodder').feature;
feature('log in', function (when) {
  when('successful login', 'show user homepage');
  when('unsuccessful login', 'show login error message');
});

// controllers.js
var fire = require('fodder').fire;
var startFeature = require('fodder').startFeature;
function whenLoginButtonClicked() {
    startFeature('log in');
    sendLoginInfoToServer()
        .success(function() {
            fire('successful login');
        })
        .error(function() {
            fire('unsuccessful login');
        };
}

// routing.js
var listen = require('fodder').listen;
listen('show user homepage', function() {
    router.navigate('user-home');
});

// notifications.js
var listen = require('fodder').listen;
var toastr = require('toastr');
listen('show login error message', function() {
    toastr.error('There was a problem logging in!');
});
```