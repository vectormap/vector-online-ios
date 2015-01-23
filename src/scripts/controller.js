var {Catalog} = require('api');
var imm = require('immutable').fromJS;

var {
  prepareQuickSearch
} = require('./models/SearchModel');

var OrgModel    = require('./models/OrgModel');

var rootBinding;
var bSearch;
var bSearchTerm;
var bSearchSuggestions;
const searchTypingThrottleTime = 500;

function setSearchView (view) {
  bSearch.set('view', view);
}

function unsetSearchView () {
  rootBinding.delete('searchView');
}

var Controller = {
  init (binding) {
    rootBinding        = binding;
    bSearch            = rootBinding.sub('search');
    bSearchTerm        = bSearch.sub('term');
    bSearchSuggestions = bSearch.sub('suggestions');

    this.attachListeners();
  },

  attachListeners () {
    // if we typed something, request suggestions, then show it
    // TODO: ChangesDescriptor should have the current binding value
    bSearchTerm.addListener(
      this.loadSearchSuggestions
      // _.throttle(this.loadSearchSuggestions, searchTypingThrottleTime)
    );
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
    var query = bSearchTerm.get();

    console.log('query', query);

    if (query) {
      Catalog.quickSearch(query).then((data) => {
        var data = prepareQuickSearch(data);
        bSearchSuggestions.set(imm(data));
      })
      .fail(err => console.error('loadSearchSuggestions', err))
      .done();
    }
  }
};

module.exports = Controller;
