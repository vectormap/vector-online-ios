var {Catalog} = require('api');
var imm = require('immutable').fromJS;
var P = require('bluebird');
var translator = require('i18n/translator');

var {
  prepareQuickSearch
} = require('./models/SearchModel');

var OrgModel = require('./models/OrgModel');

var rootBinding;
var bSearch;
var bSearchTerm;
var bSearchSuggestions;
var _t;

const searchTypingThrottleTime = 500;
const defaultLang = 'ru';

function setSearchView (view) {
  bSearch.set('view', view);
}

function unsetSearchView () {
  bSearch.clear('view');
}

var Controller = {
  init (binding) {
    rootBinding        = binding;
    bSearch            = rootBinding.sub('search');
    bSearchTerm        = bSearch.sub('term');
    bSearchSuggestions = bSearch.sub('suggestions');

    this.attachListeners();
  },

  t (key) {
    var lang = rootBinding.get('lang');

    return translator.t(lang, key);
  },

  attachListeners () {
    // if we typed something, request suggestions, then show it
    // TODO: ChangesDescriptor should have the current binding value

    bSearchTerm.addListener(this.showSearchHistoryOrSuggestions);
    bSearchTerm.addListener(this.loadSearchSuggestions);
    bSearchSuggestions.addListener(this.showSearchHistoryOrSuggestions);
  },

  start () {

  },

  showSearchHistoryOrSuggestions () {
    var suggestions = bSearch.get('suggestions');

    if (!bSearchTerm.get()) { // empty search, show history
      setSearchView('history');
    } else if (suggestions.size > 0) {
      setSearchView('suggestions');
    } else {
      unsetSearchView();
    }
  },

  loadSearchSuggestions () {
    console.log('loadSearchSuggestions');

    var query = bSearchTerm.get();

    P.resolve(Catalog.quickSearch(query)).then((data) => {
      var data = prepareQuickSearch(data);

      bSearchSuggestions.set(imm(data));
    })
    .error(err => console.error('loadSearchSuggestions', err));
  }
};

module.exports = Controller;
