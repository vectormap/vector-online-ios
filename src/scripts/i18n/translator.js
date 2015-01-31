var langs = {
  ru: require('./langs/ru'),
  en: require('./langs/en'),
  az: require('./langs/az')
};

function translate (lang, key) {
  var l = langs[lang];

  if (!l) {
    throw new Error('Invalid language:', lang);
  }

  return l[key];
}

module.exports = {
  t: translate
};
