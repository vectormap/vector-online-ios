var _ = require('lodash');

var langs = {
  ru: require('./langs/ru'),
  en: require('./langs/en'),
  az: require('./langs/az')
};

var currentLang;
var compiled = {};

function translate (lang, key, args) {
  var l = langs[lang];

  if (!l) {
    throw new Error('Invalid language:', lang);
  }

  return l[key];
}

module.exports = {
  t: translate
};
