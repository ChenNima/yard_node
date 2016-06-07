angular-extended-notifications
==============================

Highly customizable notifications with AngularJS

# Setup

### Install the library

With Bower:

    bower install angular-extended-notifications

With NPM:

    npm install angular-extended-notifications


### Then, include the js file in your project:

    <script src='bower_components/angular-extended-notifications/angular-extended-notifications.min.js' type='text/javascript'></script>

Replace ```bower_components``` by ```node_modules``` if necessary.


### Finally, include the module in your app:

```js
angular.module('my-project', [
  // [...]
  'angular-extended-notifications'
])

.config(function (notificationsProvider) {
  // change default options (that can be overridden in a specific call later if necessary)
  notificationsProvider.setDefaults({
    // set the directory containing the html templates
    templatesDir: 'node_modules/angular-extended-notifications/templates/',
    // use font-awesome icons
    faIcons: true,
    // close notifications on route change
    closeOnRouteChange: 'route' // or 'state' using uiRouter…
  });
});
```

And use the service as you wish

```js
angular.module('my-project').controller('my-controller', function(notifications) {
  'use strict';

  // use notifications
});
```

# Documentation

## Simple call

With title and message arguments:

```js
notifications.info('Hello title', 'Message to the world!');
notifications.warning('Hello title', 'Message to the world!');
notifications.error('Hello title', 'Message to the world!');
notifications.success('Hello title', 'Message to the world!');
notifications.info('Hello title', 'Message to the world!');
```

With a configuration object:

```js
notifications.info({
  title: 'Hello title',
  message: 'Message to the world!'
});

notifications.notify({
  type: 'info'
  title: 'Hello title',
  message: 'Message to the world!'
});
```

## Style it a little…

### Change CSS classes

Configure your CSS to style special notifications:

```js
notifications.info('Hello title', 'Message to the world!', {
  className: 'custom-class'
});
```

### Display font-awesome icons

The library can use [font-awesome](http://fortawesome.github.io/Font-Awesome/) icons:

```js
notifications.info('Hello title', 'Message to the world!', {
  faIcon: false // no icon
});

notifications.info('Hello title', 'Message to the world!', {
  faIcon: 'fa-heart' // with a different icon
});
```

To always enable font-awesome icons:

```js
notifications.setDefaults({faIcons: true});
```

## Configure it a little further…

### Close button

Override the close button:

```js
notifications.info('Hello title', 'Message to the world!', {
  closeButton: false
});
```

### Notification positionning

Attach the notification anywhere you want (they are prepended on body by default):

```js
notifications.info('Hello title', 'Message to the world!', {
  attachTo: $('#my-div') // prepend
});

notifications.info('Hello title', 'Message to the world!', {
  // describe how you want to attach the template by yourself
  attachTo: function(template) {
    $myDiv.append(template);
  }
});
```

### Duration and close conditions

Change the notification duration on creation:

```js
var notif = notifications.info('Hello title', 'Message to the world!', {
  duration: 10000 // 10s
});
```

Or on the fly:

```js
notif.changeDuration(5000); // 5s
notif.changeDuration(-1); // unlimited
```

Hide the notification on route or state change:

```js
notifications.info('Hello title', 'Message to the world!', {
  closeOnRouteChange: 'route' // use angular's router (would have been 'state' for uiRouter)
});
```

### Configure default options in config phase:

```js
angular.config(function (notificationsProvider) {
  notificationsProvider
    // change default options (that can be overridden in a specific call later if necessary)
    .setDefaults({
      // -- any valid options like: --
      faIcon: true
    })
    .setFaIcons({
      // set one or many custom icons: info, success, error, warning
      success: 'fa-heart'
    })
  ;
});
```

## Try some more powerful stuff…

### Callbacks

Trigger callbacks when the notification appears or closes:

```js
var timestamp;
notifications.info('Hello title', 'Message to the world!', {
  show: function () {
    console.log('The notification appears');
    timestamp = +new Date();
  },
  close: function () {
    var time = (+new Date() - timestamp) / 1000;
    console.log('The notification was shown ' + time + 's')

    return false; // by returning false, I can cancel the closing of the notification to let it open (if I changed my mind…)
  }
});
```

### Custom actions

Add custom actions in the notification (for example a 'Dismiss' button):

```js
var notif = notifications.info('Hello title', 'Message to the world!', {
  actions: [{
    label: 'Dismiss',
    fn: function () {
      console.log('This function executes when you click on 'Dismiss'');
      notif.close();
    }
  }]
});
```

Or like GMail's cancellation:

```js
var notif;

var onError = function(err) {
  notif.close();
  notif = notification.error({
    title: 'Error (' + err.code + ')'
    message: err.message,
    duration: -1
  });
}

notif = notifications.info({
  message: 'Sending…',
  duration: -1,
  actions: [{
    label: 'Cancel',
    fn: function () {
      notif.close();
      notif = notifications.warning({
        message: 'Cancelling…',
        duration: -1,
      });
      DoTheCancelling()
        .then(function () {
          notif.close();
          notif = notifications.success({
            message: 'Cancelled !'
          });
        })
        .catch(onError)
      ;
    },
  }],
});

DoTheSending(myData)
  .then(function () {
    notif = notifications.success({
      message: 'Sent !'
    });
  });
  .catch(onError)
;
```

### Use a custom template

```js
notifications.info('Hello title', 'Message to the world!', {
  template: 'my-custom-template' // by name (without extension)
});

notifications.info('Hello title', 'Message to the world!', {
  templateFile: 'my-custom-template.html' // by filename (with extension)
});
```

Override the template directory:

```js
notifications.info('Hello title', 'Message to the world!', {
  templatesDir: '/templates/'
});
```

The data object passed as parameter is available in the templates' scope:

```js
notifications.info('Hello title', 'Message to the world!', {
  username: myUser
});
```

See the bundled templates as examples.


### Use webkitNotifications (html5 notifications)

Webkit notifications are available as described in the [draft spec](http://dvcs.w3.org/hg/notifications/raw-file/tip/Overview.html).

To enhance the browser compatibilities, you can include the bundled shim for Firefox 22+ if necessary.

```js
notifications.info('Hello title', 'Message to the world!', {
  webkitNotifications: {
    iconFile: 'favicon.ico'
  }
});
```

You can use HTMLNotifications if you want a custom template:

```js
notifications.info('Hello title', 'Message to the world!', {
  webkitNotifications: {
    notificationUrl: 'url/to/the/notification/content'
  }
});
```

To enable the webkitNotifications by default:

```js
notifications.useWebkitNotifications({
  // data.webkitNotifications object
  iconFile: 'favicon.ico'
});
```

and to disable:

```js
notifications.useWebkitNotifications(false);
```


# Tests

Pull requests are welcome!


# You've seen a bug, you'd like a feature

Pull requests are welcome! (and an issue tracker is available)


# License

The library "angular-extended-notifications" is freely distributable under the terms of the MIT license.

Copyright (c) 2013 Etienne Folio

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
