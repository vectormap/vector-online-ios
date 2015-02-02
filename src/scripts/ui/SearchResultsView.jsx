var React = require('react');
var M = require('morearty');
var SearchTabsView = require('./SearchTabsView');

var SearchResultsView = React.createClass({
  mixins: [M.Mixin],

  render: function() {
    var searchBinding = this.getBinding();
    var searchType = searchBinding.get('type');

    return (
      <div className="pane">
        {searchType === 'query' &&
          <SearchTabsView binding={searchBinding} />}
      </div>
    );
  }

});

module.exports = SearchResultsView;
