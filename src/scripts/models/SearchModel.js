var _ = require('lodash');
var {randomizeOrgsInOneLevel} = require('./OrgModel');
var {result} = require('api');

var SearchModel = {
  prepareSearch () {

  },

  prepareSearchSuggestions ([organizations = [], rubrics = [], addresses = []]) {
    // put rubrics first
    var suggestions = [].concat(rubrics, organizations, addresses);

    suggestions = suggestions.map(s => {
      var suggestionList = result(s);
      var {collection} = s;

      if (collection === 'organizations') {
        suggestionList = randomizeOrgsInOneLevel(suggestionList);
      }

      suggestionList.forEach(item => item.collection = collection);

      return suggestionList;
    });

    return _.flatten(suggestions);
  },

  prepareSearchResults (results = []) {
    results = results.map(result => {
      if (result.collection === 'organizations') {
        result.data.result = randomizeOrgsInOneLevel(result.data.result);
      }

      return result;
    })

    return results;
  }
};

module.exports = SearchModel;
