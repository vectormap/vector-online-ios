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

  renderSearchView () {
    var bSearch    = this.getBinding().sub('search');
    var dataKey    = bSearch.get('view');
    var SearchView = resolveView(searchViews, bSearch, 'view');
    var bData      = bSearch.sub(dataKey);
    var hasData    = bData.get() && bData.get().size > 0;

    return {
      SearchView: hasData && SearchView,
      dataBinding: bData
    };
  },

  render () {
    var binding = this.getBinding();
    var {SearchView, dataBinding} = this.renderSearchView();

    return (
      <div>
        <SearchBar binding={binding} />
        <div id="map" className="view-container" nav-view-transition="ios" nav-view-direction="none"></div>
        {SearchView &&
          <div className="view-container has-header" nav-view-transition="ios" nav-view-direction="none">
            <SearchView binding={dataBinding} />
          </div>}
      </div>
    );
  }

});

module.exports = MainLayout;
