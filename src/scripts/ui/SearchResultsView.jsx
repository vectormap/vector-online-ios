var React                 = require('react');
var M                     = require('morearty');
var SearchTabsView        = require('./SearchTabsView');
var SearchDescriptionView = require('./SearchDescriptionView');
var ItemsListView         = require('./ItemsListView');

var SearchResultsView = React.createClass({
  mixins: [M.Mixin],

  render: function() {
    var searchBinding = this.getBinding();
    var searchType = searchBinding.get('type');
    var resultsBinding = searchBinding.sub('results');
    var firstResultBinding = resultsBinding.sub(0);
    var results = resultsBinding.get();
    var currentCollection = searchBinding.get('view.tab');

    var currentResultIndex = results.findIndex(
      r => r.get('collection') === currentCollection); // TODO: save current index in state

    return (
      <div className="pane">
        {searchType === 'query' &&
          <SearchTabsView binding={searchBinding} />}

        {searchType !== 'query' &&
          <SearchDescriptionView binding={firstResultBinding} />}

        <ItemsListView binding={resultsBinding.sub(currentResultIndex)} />
      </div>
    );
  }

});

module.exports = SearchResultsView;
