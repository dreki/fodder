I'm proud to say that fodder is being supported by BrowserStack!

<img src="http://i.imgur.com/LMRz23i.png" height="30" alt="BrowserStack" />

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

Your "features.js" file is now your map of your whole application. When you want to create
a new feature, you come here and define how it should work in plain English. Even your
product designers will be able to understand how the application works.

Other benefits include ultimate testability. Consider how easy it would be to pass in mock
data to the 'add product to cart' step here:

```js
// controllers.js
fire('add product to cart', {item: this.selectedItem});

// cart.js
listen('add product to cart', function(data) {
    tellServerToPutItemInCard(data.item_id);
});
```

## more

### specify an event to fire when starting a feature

You can have an event fire as soon as you call `startFeature`:

```js
var startFeature = require('fodder').startFeature;
startFeature('user home page', 'load user data');
```

### fire multiple events

You can use `when` to fire multiple events:

```js
feature('user home', function (when) {
  when('user home loaded', 'show spinner', 'load user data');
  when('user data loaded', 'display user data', 'hide spinner');
});
```

### automatically fire an event when starting a feature

```js
feature('read book', function(when, startWith) {
  startWith('recite title of book');
  when('user wants to read book', 'open book');
})
```

## installation

Install fodder via npm: https://www.npmjs.com/package/fodder
