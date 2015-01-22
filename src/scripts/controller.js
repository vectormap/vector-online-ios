var api = require('api');

var rootBinding;
var bSearch;
var bSearchTerm;

function attachListeners () {
  // if we typed something, request suggestions, then show it
  // TODO: ChangesDescriptor should have the current binding value
  bSearchTerm.addListener(() => {
    Controller.showSearchHistoryOrSuggestions();
  });
}

function setSearchView (view) {
  bSearch.set('view', view);
}

function unsetSearchView () {
  rootBinding.delete('searchView');
}

var Controller = {
  init (binding) {
    rootBinding = binding;
    bSearch = rootBinding.sub('search');
    bSearchTerm = bSearch.sub('term');
    attachListeners();
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
};

module.exports = Controller;
