var M                     = require('morearty');
var React                 = require('react/addons');
var SearchBar             = require('./SearchBar');
var SearchHistoryView     = require('./SearchHistoryView');
var SearchSuggestionsView = require('./SearchSuggestionsView');
var SearchResultsView     = require('./SearchResultsView');
var {resolveView}         = require('utils');

var searchViews = {
  'history': SearchHistoryView,
  'suggestions': SearchSuggestionsView,
  'results': SearchResultsView
};

var MainLayout = React.createClass({
  mixins: [M.Mixin],

  render: function() {
    var binding = this.getBinding();
    var SearchView = resolveView(searchViews, binding, 'search.view');

    return (
      <div>
        <SearchBar binding={binding} />
        <div id="map" className="view-container" nav-view-transition="ios" nav-view-direction="none"></div>
        {SearchView &&
          <div className="view-container has-header" nav-view-transition="ios" nav-view-direction="none">
            <SearchView />
          </div>}
      </div>
    );
  }

});

module.exports = MainLayout;
