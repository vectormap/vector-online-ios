var M                 = require('morearty');
var React             = require('react/addons');
var SearchBar         = require('./SearchBar');
var ItemView          = require('./ItemView');
var ErrorView         = require('./ErrorView');
var SearchResultsView = require('./SearchResultsView');
var NotFoundView      = require('./NotFoundView');
var {resolveView}     = require('utils');

var searchViews = {
  'results': SearchResultsView,
  'item': ItemView,
  'notFound': NotFoundView,
  'error': ErrorView
};

var MainLayout = React.createClass({
  mixins: [M.Mixin],

  renderSearchView () {
    var bSearch    = this.getBinding().sub('search');
    var SearchView = resolveView(searchViews, bSearch, 'view.name');

    return SearchView;
  },

  render () {
    var binding = this.getBinding();
    var SearchView = this.renderSearchView();

    return (
      <div>
        <SearchBar binding={binding} />
        <div id="map" className="view-container" nav-view-transition="ios" nav-view-direction="none"></div>
        {SearchView &&
          <div className="view-container has-header" nav-view-transition="ios" nav-view-direction="none">
            <SearchView binding={binding.sub('search')} />
          </div>}
      </div>
    );
  }

});

module.exports = MainLayout;
