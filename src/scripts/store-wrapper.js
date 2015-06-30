var Store = require('store');

// fix 'QuotaExceededError: DOM Exception 22' in Safari private mode
var StoreWrapper = {
  get: function (key) {
    if (Store.enabled) {
      return Store.get(key);
    }
  },

  set: function (key, val) {
    if (Store.enabled) {
      return Store.set(key, val);
    }
  }
};

module.exports = StoreWrapper;
