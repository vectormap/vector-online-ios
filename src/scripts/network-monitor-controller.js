var {loadAllCityConfigs} = require('controller');
var page = require('page');

var rootBinding;
var noConnectionBinding;

function reload () {
  page(page.current);
  loadAllCityConfigs();
}

var NetworkMonitorController = {
  init (binding) {
    rootBinding = binding;
    noConnectionBinding = binding.sub('noConnection');

    document.addEventListener("offline", () => {
      console.log('I am offline');
      rootBinding.set('noConnection', true);
    }, false);

    document.addEventListener("online", () => {
      console.log('I am online');
      rootBinding.set('noConnection', false);
      reload();
    }, false);
  },

  tryToConnect () {
    if (navigator.connection && navigator.connection.type !== 'none') {
      rootBinding.set('noConnection', false);
      reload();
    }
  }
};

module.exports = NetworkMonitorController;
