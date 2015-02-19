var App = require('online-app'); // global require

if (window.cordova) {
  document.addEventListener('deviceready', function () {
    App.start();
  }, false);
} else {
  App.start();
}
