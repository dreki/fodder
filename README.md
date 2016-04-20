# fodder -- feature oriented development

fodder provides a new way to write applications. It looks like this:

```js
// your features.js file.
// this is where you define all your app's features
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

## discussion

fodder provides an alternative to the 'straight line of death' that is most applications.

Usually a request comes into your application and follows a straight line from the
entry point through things like database access, validation, authentication, HTML rendering,
and on and on. If anything goes wrong at any point on this line, the whole thing explodes
and you're left to hunt for wherever the failure occurred and _why_. You don't know where
the logic began or what its end point is meant to be. You don't even know what the user
was doing when the failure occurred!

With fodder and feature oriented development, features - and what can and will happen during their
execution - are well known. If a failure occurs in one step (e.g. when logging in), you will know
what the user wanted to do along with which exact step failed.

More importantly, your development is now decoupled. Chunks of functionality are put together
into a cohesive whole. You can see in your code exactly where a feature's work begins,
and because individual pieces are clearly defined, you can debug your code knowing exactly
what it's meant to do.

Because pieces of functionality (e.g. 'send login request to server', 'add item to cart')
are completely encapsulated and responsible for only one thing, you can use them
elsewhere in a cause-effect relationship. _This_ is true code reuse. This is the dream
in action.

```js
// let's reuse some things!
feature('log in', function (when) {
  when('already logged in', 'show user homepage');
  when('successful login', 'show user homepage');

  when('username not known', 'show login error message');
  when('password not correct', 'show login error message');
});
```